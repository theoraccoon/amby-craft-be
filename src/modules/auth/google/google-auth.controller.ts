import { Controller, Get, UseGuards, Req, Res } from '@nestjs/common';
import { AuthGuard } from '@nestjs/passport';
import { ApiTags } from '@nestjs/swagger';
import { Request, Response } from 'express';
import { CONTENT_TYPES, API_CONSTANTS, AUTH_LITERALS } from '@common/config/constants';
import { GoogleAuthService } from './services/google-auth.service';
import { ConfigService } from '@nestjs/config';

@ApiTags(API_CONSTANTS.GOOGLE_API_TAG)
@Controller()
export class GoogleAuthController {
  constructor(
    private readonly googleAuthService: GoogleAuthService,
    private readonly configService: ConfigService,
  ) {}

  @Get(API_CONSTANTS.GOOGLE_AUTH)
  @UseGuards(AuthGuard(API_CONSTANTS.GOOGLE))
  async googleAuth() {}

  @Get(API_CONSTANTS.GOOGLE_AUTH_CALLBACK)
  @UseGuards(AuthGuard(API_CONSTANTS.GOOGLE))
  async googleAuthRedirect(@Req() req: Request, @Res() res: Response) {
    const { user } = req;

    if (!user) {
      throw new Error(CONTENT_TYPES.USER_NOT_FOUND);
    }

    const { accessToken, refreshToken } = req.user as {
      accessToken: string;
      refreshToken: string;
    };

    res.cookie(AUTH_LITERALS.ACCESSTOKEN, accessToken, {
      httpOnly: true,
      secure: this.configService.get<string>('NODE_ENV') === 'development' ? false : true,
      sameSite: 'strict',
      maxAge: CONTENT_TYPES.ACCESS_TOKEN_EXPIRY,
    });

    res.cookie(AUTH_LITERALS.REFRESHTOKEN, refreshToken, {
      httpOnly: true,
      secure: this.configService.get<string>('NODE_ENV') === 'development' ? false : true,
      sameSite: 'strict',
      maxAge: CONTENT_TYPES.REFRESH_TOKEN_EXPIRY,
    });

    return res.redirect(process.env.FRONTEND_URL || AUTH_LITERALS.FRONTEND_URL);
  }
}
