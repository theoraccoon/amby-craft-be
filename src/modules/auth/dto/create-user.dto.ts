import { IsEmail, IsNotEmpty, IsString, MinLength, MaxLength, Matches } from '@nestjs/class-validator';
import { ApiProperty } from '@nestjs/swagger';

export class CreateUserDto {
  @IsNotEmpty()
  @IsString()
  @MinLength(2)
  @MaxLength(50)
  @ApiProperty()
  firstName: string;

  @IsNotEmpty()
  @IsString()
  @MinLength(2)
  @MaxLength(50)
  @ApiProperty()
  lastName: string;

  @IsNotEmpty()
  @IsEmail({}, { message: 'email must be a valid email' })
  @ApiProperty()
  email: string;

  @IsNotEmpty()
  @IsString()
  @MinLength(8)
  @MaxLength(32)
  @Matches(/^(?=.*[A-Z])(?=.*[a-z])(?=.*\d)(?=.*[\W_]).*$/, {
    message: 'Password must contain upper and lower case letters, a number, and a special character.',
  })
  @ApiProperty()
  password: string;
}
