import {
  Column,
  CreateDateColumn,
  Entity,
  Index,
  JoinColumn,
  ManyToOne,
  OneToMany,
  PrimaryGeneratedColumn,
} from 'typeorm';
import { ColumnNumericTransformer } from '../../common/transformers/column-numeric.transformer';
import { Transaction } from '../../transactions/entities/transaction.entity';
import { User } from '../../users/entities/user.entity';

@Entity('accounts')
export class Account {
  @PrimaryGeneratedColumn('uuid')
  id: string;

  // Chủ tài khoản. Xóa user thì xóa luôn account.
  @ManyToOne(() => User, (user) => user.accounts, {
    nullable: false,
    onDelete: 'CASCADE',
  })
  @JoinColumn({ name: 'user_id' })
  user: User;

  @Column({ name: 'user_id', type: 'uuid' })
  userId: string;

  // Số tài khoản tự sinh, duy nhất toàn hệ thống.
  @Index({ unique: true })
  @Column({ name: 'account_number', type: 'varchar', length: 32, unique: true })
  accountNumber: string;

  // Số dư — numeric(18,2), KHÔNG dùng float. Transformer ép về number ở tầng app.
  @Column({
    type: 'numeric',
    precision: 18,
    scale: 2,
    default: 0,
    transformer: new ColumnNumericTransformer(),
  })
  balance: number;

  @Column({ type: 'varchar', length: 3, default: 'VND' })
  currency: string;

  @CreateDateColumn({ name: 'created_at', type: 'timestamptz' })
  createdAt: Date;

  // Giao dịch ghi nợ (tiền ra) từ tài khoản này.
  @OneToMany(() => Transaction, (tx) => tx.fromAccount)
  outgoingTransactions: Transaction[];

  // Giao dịch ghi có (tiền vào) tới tài khoản này.
  @OneToMany(() => Transaction, (tx) => tx.toAccount)
  incomingTransactions: Transaction[];
}
