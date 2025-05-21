import { Injectable } from '@nestjs/common';
import { Request, Response, CookieOptions } from 'express';
import { ConfigService } from '@nestjs/config';
import { AUTH_LITERALS, CONTENT_TYPES } from '@common/config/constants';

@Injectable()
export class AuthUtils {
  constructor(private readonly configService: ConfigService) {}

  isValidRedirectUrl(url: string): boolean {
    try {
      const allowedDomains = this.configService.get<string[]>('ALLOWED_REDIRECT_DOMAINS', []);
      const parsedUrl = new URL(url);
      return allowedDomains.includes(parsedUrl.origin);
    } catch {
      return false;
    }
  }

  getValidRedirectUrl(req: Request, res: Response): string {
    const signedRedirectUrl = req.signedCookies?.[AUTH_LITERALS.REDIRECT_URL];

    const fallbackUrl = this.configService.get<string>('FRONTEND_FALLBACK_URL') || '/auth/login-success';

    if (signedRedirectUrl && this.isValidRedirectUrl(signedRedirectUrl)) {
      this.clearSpecificCookie(res, AUTH_LITERALS.REDIRECT_URL);
      return signedRedirectUrl;
    }

    return fallbackUrl;
  }

  setAuthCookies(res: Response, accessToken: string, refreshToken: string): void {
    const isProduction = this.configService.get('NODE_ENV') === 'production';

    const baseCookieOptions: CookieOptions = {
      httpOnly: true,
      secure: isProduction,
      sameSite: 'lax',
    };

    res.cookie(AUTH_LITERALS.ACCESSTOKEN, accessToken, {
      ...baseCookieOptions,
      maxAge: CONTENT_TYPES.ACCESS_TOKEN_EXPIRY,
    });

    res.cookie(AUTH_LITERALS.REFRESHTOKEN, refreshToken, {
      ...baseCookieOptions,
      maxAge: CONTENT_TYPES.REFRESH_TOKEN_EXPIRY,
    });
  }

  flushAuthCookies(res: Response): void {
    const isProduction = this.configService.get('NODE_ENV') === 'production';
    const baseCookieOptions: CookieOptions = {
      httpOnly: true,
      secure: isProduction,
      sameSite: 'lax',
      path: '/',
    };

    res.clearCookie(AUTH_LITERALS.ACCESSTOKEN, baseCookieOptions);
    res.clearCookie(AUTH_LITERALS.REFRESHTOKEN, baseCookieOptions);
  }

  clearSpecificCookie(res: Response, name: string): void {
    const isProduction = this.configService.get('NODE_ENV') === 'production';
    const baseCookieOptions: CookieOptions = {
      httpOnly: true,
      secure: isProduction,
      sameSite: 'lax',
      path: '/',
    };
    res.clearCookie(name, baseCookieOptions);
  }

  setSpecificCookie(res: Response, name: string, value: string, options: CookieOptions): void {
    console.log('Setting cookie:', name, value, options);
    res.cookie(name, value, options);
  }
}
