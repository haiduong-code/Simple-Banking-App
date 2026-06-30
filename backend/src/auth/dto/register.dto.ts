import { ApiProperty } from '@nestjs/swagger';
import { IsEmail, IsString, MaxLength, MinLength } from 'class-validator';

export class RegisterDto {
  @ApiProperty({ example: 'Nguyễn Văn A' })
  @IsString()
  @MinLength(2)
  @MaxLength(100)
  fullName: string;

  @ApiProperty({ example: 'a@example.com' })
  @IsEmail({}, { message: 'Email không hợp lệ' })
  @MaxLength(255)
  email: string;

  @ApiProperty({ example: 'matkhau123', minLength: 6 })
  @IsString()
  @MinLength(6, { message: 'Mật khẩu tối thiểu 6 ký tự' })
  @MaxLength(72) // giới hạn bcrypt
  password: string;
}
