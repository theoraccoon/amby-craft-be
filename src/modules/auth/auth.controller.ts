import { AUTH_LITERALS } from '@common/config/constants';
import { AuthUtils } from '@common/utils/auth.utils';
import { Body, Controller, Get, HttpCode, Post, Req, Res, UseGuards, ValidationPipe, UnauthorizedException } from '@nestjs/common';
import { ConfigService } from '@nestjs/config';
import { CommandBus } from '@nestjs/cqrs';
import { Response, Request } from 'express';
import { LoginUserCommand } from './commands/login-user.command';
import { LogoutUserCommand } from './commands/logout-user.command';
import { RegisterUserCommand } from './commands/register-user.command';
import { CreateUserDto } from './dto/create-user.dto';
import { LoginDto } from './dto/login.dto';
import { GoogleAuthGuard } from './guards/google-auth.guard';
import { JwtAuthGuard } from './guards/jwt-auth.guard';
import { RefreshTokenCommand } from './commands/refresh-token.command';

@Controller('auth')
export class AuthController {
  constructor(
    private readonly commandBus: CommandBus,
    private readonly authUtils: AuthUtils,
    private readonly configService: ConfigService,
  ) {}

  @Post('login')
  @HttpCode(200)
  async login(@Res({ passthrough: true }) res: Response, @Body(ValidationPipe) body: LoginDto) {
    const { accessToken, refreshToken, user } = await this.commandBus.execute(new LoginUserCommand(body));
    this.authUtils.setAuthCookies(res, accessToken, refreshToken);

    return user;
  }

  @Post('signup')
  @HttpCode(201)
  async signup(@Body(ValidationPipe) createUserRequest: CreateUserDto, @Res({ passthrough: true }) res: Response) {
    const { accessToken, refreshToken, user } = await this.commandBus.execute(new RegisterUserCommand(createUserRequest));
    this.authUtils.setAuthCookies(res, accessToken, refreshToken);

    return user;
  }

  @UseGuards(GoogleAuthGuard)
  @Get('login/google')
  async initiateGoogleAuth() {}

  @UseGuards(GoogleAuthGuard)
  @Get('google/callback')
  async googleAuthRedirect(@Req() req: Request, @Res() res: Response) {
    const { accessToken, refreshToken } = req.user as { accessToken: string; refreshToken: string };
    this.authUtils.setAuthCookies(res, accessToken, refreshToken);

    const redirectUrl = this.authUtils.getValidRedirectUrl(req, res);
    console.log('Redirecting to:', redirectUrl);
    return res.redirect(redirectUrl);
  }

  @Post('refresh-token')
  @HttpCode(200)
  async refreshToken(@Req() req: Request, @Res({ passthrough: true }) res: Response) {
    const refreshTokenFromCookie = req.cookies[AUTH_LITERALS.REFRESHTOKEN];

    if (!refreshTokenFromCookie) {
      this.authUtils.flushAuthCookies(res);
      throw new UnauthorizedException('Refresh token not found in cookies.');
    }

    try {
      const newTokens = await this.commandBus.execute(new RefreshTokenCommand(refreshTokenFromCookie));
      this.authUtils.setAuthCookies(res, newTokens.accessToken, newTokens.refreshToken);
      return { message: 'Tokens refreshed successfully.' };
    } catch (error) {
      this.authUtils.flushAuthCookies(res);
      throw error;
    }
  }

  @UseGuards(JwtAuthGuard)
  @Post('logout')
  @HttpCode(204)
  async logout(@Req() req: Request, @Res({ passthrough: true }) res: Response) {
    const user = req.user as { userId: string };
    await this.commandBus.execute(new LogoutUserCommand(user.userId));
    this.authUtils.flushAuthCookies(res);
  }
}
