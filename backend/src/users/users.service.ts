import {
  ConflictException,
  Injectable,
  NotFoundException,
} from '@nestjs/common';
import { InjectRepository } from '@nestjs/typeorm';
import * as bcrypt from 'bcrypt';
import { Repository } from 'typeorm';
import { User } from './entities/user.entity';

const BCRYPT_SALT_ROUNDS = 10;

@Injectable()
export class UsersService {
  constructor(
    @InjectRepository(User)
    private readonly userRepo: Repository<User>,
  ) {}

  findByEmail(email: string): Promise<User | null> {
    return this.userRepo.findOne({ where: { email: email.toLowerCase() } });
  }

  async findById(id: string): Promise<User> {
    const user = await this.userRepo.findOne({ where: { id } });
    if (!user) {
      throw new NotFoundException('Không tìm thấy người dùng');
    }
    return user;
  }

  /**
   * Tạo user mới: hash mật khẩu bằng bcrypt, không lưu plaintext.
   * Ném ConflictException nếu email đã tồn tại.
   */
  async create(input: {
    fullName: string;
    email: string;
    password: string;
  }): Promise<User> {
    const email = input.email.toLowerCase();
    const existed = await this.findByEmail(email);
    if (existed) {
      throw new ConflictException('Email đã được sử dụng');
    }

    const passwordHash = await bcrypt.hash(input.password, BCRYPT_SALT_ROUNDS);
    const user = this.userRepo.create({
      fullName: input.fullName,
      email,
      passwordHash,
    });
    return this.userRepo.save(user);
  }

  /** So khớp mật khẩu plaintext với hash đã lưu. */
  comparePassword(plain: string, hash: string): Promise<boolean> {
    return bcrypt.compare(plain, hash);
  }
}
