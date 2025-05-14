import { Injectable } from '@nestjs/common';
import { PassportStrategy } from '@nestjs/passport';
import { Strategy, VerifyCallback, Profile as GoogleProfile } from 'passport-google-oauth20';
import { GoogleAuthService } from 'src/modules/auth/google/services/google-auth.service';
import { ERRORS, TEXTS } from '@common/config/constants';
import { ConfigService } from '@nestjs/config';
import { InternalServerErrorException } from '@nestjs/common';

@Injectable()
export class GoogleStrategy extends PassportStrategy(Strategy) {
  constructor(
    configService: ConfigService,
    private readonly googleAuthService: GoogleAuthService,
  ) {
    super({
      clientID: configService.get<string>('GOOGLE_CLIENT_ID') || '',
      clientSecret: configService.get<string>('GOOGLE_CLIENT_SECRET') || '',
      callbackURL: configService.get<string>('GOOGLE_CALLBACK_URL'),
      scope: [TEXTS.EMAIL, TEXTS.PROFILE],
    });
  }

  async validate(accessToken: string, refreshToken: string, profile: GoogleProfile, done: VerifyCallback) {
    try {
      const { id, name, emails, photos } = profile;

      if (!emails || !emails[0]) {
        return done(new InternalServerErrorException(ERRORS.ERROR_GOOGLE_PROFILE_MISSING_EMAIL));
      }

      const userInfo = {
        googleId: id,
        email: emails[0].value || '',
        firstName: name?.givenName || '',
        lastName: name?.familyName || '',
        picture: photos?.[0]?.value || '',
        accessToken,
        refreshToken,
      };

      const user = await this.googleAuthService.validateOAuthLogin(userInfo);

      if (!user) {
        return done(new InternalServerErrorException(ERRORS.USER_NOT_FOUND));
      }

      done(null, user);
    } catch (error) {
      done(error, false);
    }
  }
}
