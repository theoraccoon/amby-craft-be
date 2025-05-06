import { Injectable } from '@nestjs/common';
import { PassportStrategy } from '@nestjs/passport';
import { Strategy, VerifyCallback, Profile as GoogleProfile } from 'passport-google-oauth20';
import { GoogleAuthService } from '@google/services/google-auth.service';
import { User } from '@prisma/client';
import { API_CONSTANTS, TEXTS } from 'src/config/constants';
import { ConfigService } from '@nestjs/config';

@Injectable()
export class GoogleStrategy extends PassportStrategy(Strategy, API_CONSTANTS.GOOGLE) {
  constructor(
    configService: ConfigService,
    private readonly googleAuthService: GoogleAuthService,
  ) {
    super({
      clientID: configService.get<string>('GOOGLE_CLIENT_ID') || '',
      clientSecret: configService.get<string>('GOOGLE_CLIENT_SECRET') || '',
      callbackURL: configService.get<string>('GOOGLE_CALLBACK_URL'),
      scope: [TEXTS.EMAIL, TEXTS.PROFILE],
      passReqToCallback: true,
    });
  }

  async validate(accessToken: string, refreshToken: string, profile: GoogleProfile, done: VerifyCallback): Promise<any> {
    const { id, name, emails, photos } = profile;

    const userInfo: GoogleUserInfo = {
      googleId: id,
      email: emails?.[0]?.value || '',
      firstName: name?.givenName || '',
      lastName: name?.familyName || '',
      picture: photos?.[0]?.value || '',
      accessToken,
      refreshToken,
    };

    const user = (await this.googleAuthService.validateOAuthLogin(userInfo)) as User;
    done(null, user);
  }
}

interface GoogleUserInfo {
  googleId: string;
  email: string;
  firstName: string;
  lastName: string;
  picture: string;
  accessToken: string;
  refreshToken: string;
}
