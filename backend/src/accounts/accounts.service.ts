import { Injectable, NotFoundException } from '@nestjs/common';
import { InjectRepository } from '@nestjs/typeorm';
import { Repository } from 'typeorm';
import { Account } from './entities/account.entity';

@Injectable()
export class AccountsService {
  constructor(
    @InjectRepository(Account)
    private readonly accountRepo: Repository<Account>,
  ) {}

  /**
   * Sinh số tài khoản duy nhất (10 chữ số, bắt đầu bằng 9).
   * Lặp tới khi không trùng trong DB.
   */
  private async generateUniqueAccountNumber(): Promise<string> {
    // Tối đa vài lần thử; xác suất trùng cực thấp.
    for (let i = 0; i < 10; i++) {
      const candidate =
        '9' + Math.floor(100000000 + Math.random() * 900000000).toString();
      const existed = await this.accountRepo.findOne({
        where: { accountNumber: candidate },
      });
      if (!existed) {
        return candidate;
      }
    }
    throw new Error('Không sinh được số tài khoản duy nhất');
  }

  /**
   * Tạo tài khoản mặc định cho user mới (dùng khi đăng ký).
   * initialBalance chỉ phục vụ demo/seed; mặc định 0.
   */
  async createForUser(userId: string, initialBalance = 0): Promise<Account> {
    const accountNumber = await this.generateUniqueAccountNumber();
    const account = this.accountRepo.create({
      userId,
      accountNumber,
      balance: initialBalance,
      currency: 'VND',
    });
    return this.accountRepo.save(account);
  }

  /** Lấy tài khoản theo user (GĐ3: GET /accounts/me). */
  async findByUserId(userId: string): Promise<Account> {
    const account = await this.accountRepo.findOne({ where: { userId } });
    if (!account) {
      throw new NotFoundException('Người dùng chưa có tài khoản');
    }
    return account;
  }
}
