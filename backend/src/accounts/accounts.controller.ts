import { Controller, Get, UseGuards } from '@nestjs/common';
import { ApiBearerAuth, ApiOperation, ApiTags } from '@nestjs/swagger';
import { AccountsService } from './accounts.service';
import { JwtAuthGuard } from '../auth/guards/jwt-auth.guard';
import { CurrentUser } from '../auth/decorators/current-user.decorator';
import { AuthUser } from '../auth/strategies/jwt.strategy';

@ApiTags('accounts')
@Controller('accounts')
@UseGuards(JwtAuthGuard)
@ApiBearerAuth()
export class AccountsController {
  constructor(private readonly accountsService: AccountsService) {}

  @Get('me')
  @ApiOperation({
    summary: 'Lấy thông tin tài khoản và số dư của user hiện tại',
  })
  async getMyAccount(@CurrentUser() user: AuthUser) {
    const account = await this.accountsService.findByUserId(user.userId);
    return {
      id: account.id,
      accountNumber: account.accountNumber,
      balance: account.balance,
      currency: account.currency,
      createdAt: account.createdAt,
    };
  }
}
