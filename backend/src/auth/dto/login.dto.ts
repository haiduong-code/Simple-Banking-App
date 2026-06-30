import { ApiProperty } from '@nestjs/swagger';
import { IsEmail, IsString, MaxLength } from 'class-validator';

export class LoginDto {
  @ApiProperty({ example: 'a@example.com' })
  @IsEmail({}, { message: 'Email không hợp lệ' })
  @MaxLength(255)
  email: string;

  @ApiProperty({ example: 'matkhau123' })
  @IsString()
  @MaxLength(72)
  password: string;
}
