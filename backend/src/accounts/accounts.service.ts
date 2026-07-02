import { Injectable, NotFoundException } from '@nestjs/common';
import { InjectRepository } from '@nestjs/typeorm';
import { randomInt } from 'crypto';
import { EntityManager, Repository } from 'typeorm';
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
  private async generateUniqueAccountNumber(
    accountRepo: Repository<Account>,
  ): Promise<string> {
    // Tối đa vài lần thử; xác suất trùng cực thấp.
    for (let i = 0; i < 10; i++) {
      const candidate = '9' + randomInt(100_000_000, 1_000_000_000).toString();
      const existed = await accountRepo.findOne({
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
  async createForUser(
    userId: string,
    initialBalance = '0.00',
    manager?: EntityManager,
  ): Promise<Account> {
    const accountRepo = manager?.getRepository(Account) ?? this.accountRepo;
    const accountNumber = await this.generateUniqueAccountNumber(accountRepo);
    const account = accountRepo.create({
      userId,
      accountNumber,
      balance: initialBalance,
      currency: 'VND',
    });
    return accountRepo.save(account);
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
