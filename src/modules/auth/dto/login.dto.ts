import { IsEmail, IsNotEmpty, IsString } from '@nestjs/class-validator';

export class LoginDto {
  @IsNotEmpty()
  @IsEmail({}, { message: 'email must be a valid email' })
  email: string;

  @IsNotEmpty()
  @IsString()
  password: string;
}
