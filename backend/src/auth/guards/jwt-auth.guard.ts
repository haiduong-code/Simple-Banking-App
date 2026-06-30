import { Injectable } from '@nestjs/common';
import { AuthGuard } from '@nestjs/passport';

/** Guard bảo vệ route bằng JWT (chiến lược 'jwt'). */
@Injectable()
export class JwtAuthGuard extends AuthGuard('jwt') {}
