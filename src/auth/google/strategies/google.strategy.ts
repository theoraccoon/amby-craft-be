import { Injectable } from '@nestjs/common';
import { PassportStrategy } from '@nestjs/passport';
import { Strategy, StrategyOptions, Profile } from 'passport-google-oauth20';

export interface GoogleUser {
  googleId: string;
  email?: string;
  firstName?: string;
  lastName?: string;
  profilePicture?: string;
}

@Injectable()
export class GoogleStrategy extends PassportStrategy(Strategy, 'google') {
  constructor() {
    super({
      clientID: process.env.GOOGLE_CLIENT_ID!,
      clientSecret: process.env.GOOGLE_CLIENT_SECRET!,
      callbackURL: process.env.GOOGLE_CALLBACK_URL!,
      scope: ['email', 'profile'],
    } as StrategyOptions);
  }

  validate(accessToken: string, refreshToken: string, profile: Profile): GoogleUser {
    const { id, name, emails, photos } = profile;

    return {
      googleId: id,
      email: emails?.[0]?.value,
      firstName: name?.givenName,
      lastName: name?.familyName,
      profilePicture: photos?.[0]?.value,
    };
  }
}
