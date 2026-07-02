import { createParamDecorator, ExecutionContext } from '@nestjs/common';
import { Request } from 'express';
import { AuthUser } from '../strategies/jwt.strategy';

/**
 * Lấy user đã xác thực từ request (do JwtStrategy gắn vào).
 * Dùng: `@CurrentUser() user: AuthUser`.
 */
export const CurrentUser = createParamDecorator(
  (_data: unknown, ctx: ExecutionContext): AuthUser => {
    const request = ctx
      .switchToHttp()
      .getRequest<Request & { user: AuthUser }>();
    return request.user;
  },
);
