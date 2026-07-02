import { Injectable, UnauthorizedException } from '@nestjs/common';
import { JwtService } from '@nestjs/jwt';
import { DataSource } from 'typeorm';
import { AccountsService } from '../accounts/accounts.service';
import { User, UserStatus } from '../users/entities/user.entity';
import { UsersService } from '../users/users.service';
import { RegisterDto } from './dto/register.dto';
import { LoginDto } from './dto/login.dto';

/** Dữ liệu user trả về client — KHÔNG chứa password_hash. */
export interface SafeUser {
  id: string;
  fullName: string;
  email: string;
  role: string;
  status: string;
  createdAt: Date;
}

export interface AuthResult {
  accessToken: string;
  user: SafeUser;
}

@Injectable()
export class AuthService {
  constructor(
    private readonly usersService: UsersService,
    private readonly accountsService: AccountsService,
    private readonly jwtService: JwtService,
    private readonly dataSource: DataSource,
  ) {}

  /** Loại bỏ trường nhạy cảm trước khi trả ra response. */
  private toSafeUser(user: User): SafeUser {
    return {
      id: user.id,
      fullName: user.fullName,
      email: user.email,
      role: user.role,
      status: user.status,
      createdAt: user.createdAt,
    };
  }

  private signToken(user: User): string {
    return this.jwtService.sign({
      sub: user.id,
      email: user.email,
      role: user.role,
    });
  }

  /**
   * Đăng ký: tạo user (hash bcrypt) + tự sinh 1 tài khoản mặc định,
   * rồi trả JWT để đăng nhập ngay.
   */
  async register(dto: RegisterDto): Promise<AuthResult> {
    const user = await this.dataSource.transaction(async (manager) => {
      const createdUser = await this.usersService.create(
        {
          fullName: dto.fullName.trim(),
          email: dto.email.trim(),
          password: dto.password,
        },
        manager,
      );

      // User và tài khoản mặc định phải cùng thành công hoặc cùng rollback.
      await this.accountsService.createForUser(createdUser.id, '0.00', manager);
      return createdUser;
    });

    return {
      accessToken: this.signToken(user),
      user: this.toSafeUser(user),
    };
  }

  /**
   * Đăng nhập: kiểm tra email + mật khẩu, chặn tài khoản bị khóa,
   * trả JWT access token.
   */
  async login(dto: LoginDto): Promise<AuthResult> {
    const user = await this.usersService.findByEmail(dto.email);

    // Thông báo chung chung để tránh lộ email nào tồn tại.
    if (!user) {
      throw new UnauthorizedException('Email hoặc mật khẩu không đúng');
    }

    const passwordOk = await this.usersService.comparePassword(
      dto.password,
      user.passwordHash,
    );
    if (!passwordOk) {
      throw new UnauthorizedException('Email hoặc mật khẩu không đúng');
    }

    if (user.status === UserStatus.LOCKED) {
      throw new UnauthorizedException('Tài khoản đã bị khóa');
    }

    return {
      accessToken: this.signToken(user),
      user: this.toSafeUser(user),
    };
  }
}
