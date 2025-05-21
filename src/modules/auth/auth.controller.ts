import { Body, Controller, Get, HttpCode, Post, Query, Req, Res, UseGuards, ValidationPipe, Param } from '@nestjs/common';
import { Response, Request, CookieOptions } from 'express';
import { CreateUserDto } from 'src/modules/auth/dto/create-user.dto';
import { LoginDto } from 'src/modules/auth/dto/login.dto';
import { CommandBus, QueryBus } from '@nestjs/cqrs';
import { RegisterUserCommand } from './commands/register-user.command';
import { JwtAuthGuard } from './guards/jwt-auth.guard';
import { SignOutCommand } from './commands/signout.command';
import { LoginUserCommand } from './commands/login-user.command';
import { GoogleAuthGuard } from './guards/google-auth.guard';
import { AUTH_LITERALS, CONTENT_TYPES } from '@common/config/constants';
import { ConfigService } from '@nestjs/config';
import { RefreshTokenCommand } from './commands/refresh-token.command';
import { RefreshTokenDto } from './dto/refresh-token.dto';

@Controller('auth')
export class AuthController {
  private readonly isProduction: boolean;
  private readonly frontendUrl: string;

  constructor(
    private readonly commandBus: CommandBus,
    private readonly queryBus: QueryBus,
    private readonly configService: ConfigService,
  ) {
    this.isProduction = this.configService.get<string>('NODE_ENV') === 'production';
    this.frontendUrl = this.configService.get<string>('FRONTEND_URL') || AUTH_LITERALS.FRONTEND_URL;
  }

  @Post('signup')
  async signup(@Body(ValidationPipe) createUserRequest: CreateUserDto, @Res({ passthrough: true }) res: Response) {
    const commandResult = await this.commandBus.execute(new RegisterUserCommand(createUserRequest));
    const { accessToken, refreshToken, user } = commandResult;
    await this.setCookies(res, accessToken, refreshToken);

    return user;
  }

  @Get('refresh-token')
  async refreshToken(@Body() refreshTokenRequest: RefreshTokenDto) {
    return this.commandBus.execute(new RefreshTokenCommand(refreshTokenRequest));
  }

  @Post('login')
  async login(@Res({ passthrough: true }) res: Response, @Body(ValidationPipe) body: LoginDto) {
    const commandResult = await this.queryBus.execute(new LoginUserCommand(body));
    const { accessToken, refreshToken, user } = commandResult;
    await this.setCookies(res, accessToken, refreshToken);

    return user;
  }

  @UseGuards(GoogleAuthGuard)
  @Get('login/google')
  async initiateGoogleAuth(@Query('redirectUrl') redirectUrl: string, @Res({ passthrough: true }) res: Response) {
    if (redirectUrl && this.isValidRedirectUrl(redirectUrl)) {
      res.cookie(AUTH_LITERALS.REDIRECT_URL, redirectUrl, {
        secure: this.isProduction,
        sameSite: 'strict',
        signed: true,
        maxAge: 60000,
      });
    }
  }

  @UseGuards(GoogleAuthGuard)
  @Get('google/callback')
  async googleAuthRedirect(@Req() req: Request, @Res({ passthrough: true }) res: Response) {
    const { accessToken, refreshToken } = req.cookies;
    await this.setCookies(res, accessToken, refreshToken);

    const redirectUrl = this.getValidRedirectUrl(req, res);
    return res.redirect(redirectUrl);
  }

  @UseGuards(JwtAuthGuard)
  @Post('sign-out/:userId')
  @HttpCode(204)
  async signOut(@Param('userId') userId: string, @Res({ passthrough: true }) res: Response) {
    await this.commandBus.execute(new SignOutCommand(userId));
    await this.flushCookies(res);

    return res.redirect('/');
  }

  private isValidRedirectUrl(url: string): boolean {
    try {
      const allowedDomains = this.configService.get<string[]>('ALLOWED_REDIRECT_DOMAINS', []);
      const parsedUrl = new URL(url);
      return allowedDomains.includes(parsedUrl.origin);
    } catch {
      return false;
    }
  }

  private getValidRedirectUrl(req: Request, res: Response): string {
    const signedRedirectUrl = req.signedCookies?.[AUTH_LITERALS.REDIRECT_URL];

    if (signedRedirectUrl && this.isValidRedirectUrl(signedRedirectUrl)) {
      res.clearCookie(AUTH_LITERALS.REDIRECT_URL);
      return signedRedirectUrl;
    }

    return this.frontendUrl;
  }

  async setCookies(res: Response, accessToken: string, refreshToken: string): Promise<void> {
    const cookieOptions: CookieOptions = {
      httpOnly: true,
      secure: this.isProduction,
      sameSite: 'strict',
    };

    res.cookie(AUTH_LITERALS.ACCESSTOKEN, accessToken, {
      ...cookieOptions,
      maxAge: CONTENT_TYPES.ACCESS_TOKEN_EXPIRY,
    });

    res.cookie(AUTH_LITERALS.REFRESHTOKEN, refreshToken, {
      ...cookieOptions,
      maxAge: CONTENT_TYPES.REFRESH_TOKEN_EXPIRY,
    });
  }

  async flushCookies(res: Response): Promise<void> {
    const cookieOptions: CookieOptions = {
      httpOnly: true,
      secure: this.isProduction,
      sameSite: 'strict',
      path: '/',
    };

    res.clearCookie(AUTH_LITERALS.ACCESSTOKEN, cookieOptions);
    res.clearCookie(AUTH_LITERALS.REFRESHTOKEN, cookieOptions);
  }
}
