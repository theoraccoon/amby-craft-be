import { Body, Controller, Get, HttpCode, Post, Req, Res, UseGuards, ValidationPipe } from '@nestjs/common';
import { Response, Request } from 'express';
import { CreateUserDto } from 'src/modules/auth/dto/create-user.dto';
import { LoginDto } from 'src/modules/auth/dto/login.dto';
import { CommandBus, QueryBus } from '@nestjs/cqrs';
import { RegisterUserCommand } from './commands/register-user.command';
import { JwtAuthGuard } from './guards/jwt-auth.guard';
import { SignOutCommand } from './commands/signout.command';
import { LoginQuery } from './queries/login.query';
import { refreshTokenQuery } from './queries/refresh-token';
import { GoogleAuthGuard } from './guards/google-auth.guard';
import { AUTH_LITERALS } from '@common/config/constants';

@Controller('auth')
export class AuthController {
  constructor(
    private commandBus: CommandBus,
    private queryBus: QueryBus,
  ) {}

  @Post('signup')
  async signup(@Body(ValidationPipe) body: CreateUserDto) {
    return this.commandBus.execute(new RegisterUserCommand(body));
  }

  @Get('refresh-token')
  async refreshToken(@Req() req: Request, @Res({ passthrough: true }) res: Response) {
    return this.queryBus.execute(new refreshTokenQuery(req, res));
  }

  @Post('login')
  async login(@Res({ passthrough: true }) res: Response, @Body(ValidationPipe) body: LoginDto) {
    return this.queryBus.execute(new LoginQuery(body, res));
  }

  @UseGuards(JwtAuthGuard)
  @Post('sign-out')
  @HttpCode(204)
  async signOut(@Body('userId') userId: string) {
    return this.commandBus.execute(new SignOutCommand(userId));
  }

  @UseGuards(GoogleAuthGuard)
  @Get('login/google')
  async googleAuth() {}

  @UseGuards(GoogleAuthGuard)
  @Get('google/callback')
  async googleAuthRedirect(@Req() req: Request, @Res({ passthrough: true }) res: Response) {
    const { accessToken, refreshToken } = req.cookies;
    await this.setCookies(res, accessToken, refreshToken);

    return res.redirect(process.env.FRONTEND_URL || AUTH_LITERALS.FRONTEND_URL);
  }

  async setCookies(res: Response, accessToken: string, refreshToken: string): Promise<void> {
    res.cookie(AUTH_LITERALS.ACCESSTOKEN, accessToken, {
      httpOnly: true,
      secure: process.env.NODE_ENV === 'production',
      sameSite: 'strict',
      maxAge: 1000 * 60 * 60 * 24,
    });

    res.cookie(AUTH_LITERALS.REFRESHTOKEN, refreshToken, {
      httpOnly: true,
      secure: process.env.NODE_ENV === 'production',
      sameSite: 'strict',
      maxAge: 1000 * 60 * 60 * 24,
    });
  }
}
