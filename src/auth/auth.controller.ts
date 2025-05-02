import { Body, Controller, Get, Post, Req, Res, ValidationPipe } from '@nestjs/common';
import { Response, Request } from 'express';
import { CreateUserDto } from './dto/create-user.dto';
import { LoginDto } from './dto/login.dto';
import { AuthService } from './auth.service';

@Controller('auth')
export class AuthController {
  constructor(private readonly authService: AuthService) {}

  @Post('signup')
  async signup(@Body(ValidationPipe) body: CreateUserDto) {
    return this.authService.validateUser(body);
  }

  @Get('refresh-token')
  async refreshToken(@Req() req: Request, @Res({ passthrough: true }) res: Response) {
    return this.authService.validateRefreshToken(req, res);
  }

  @Post('login')
  async login(@Res({ passthrough: true }) response: Response, @Body(ValidationPipe) body: LoginDto) {
    return this.authService.login(body, response);
  }
}
