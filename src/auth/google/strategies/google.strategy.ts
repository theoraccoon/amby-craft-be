import { Injectable } from '@nestjs/common';
import { PassportStrategy } from '@nestjs/passport';
import {
    Strategy,
    StrategyOptions,
    VerifyCallback,
} from 'passport-google-oauth20';
import { GoogleAuthService } from '../google-auth.service';
import { Profile as GoogleProfile } from 'passport-google-oauth20';

interface GoogleUserInfo {
    googleId: string;
    email: string;
    firstName: string;
    lastName: string;
    picture: string;
    accessToken: string;
    refreshToken: string;
}

@Injectable()
export class GoogleStrategy extends PassportStrategy(Strategy, 'google') {
    constructor(private googleAuthService: GoogleAuthService) {
        super({
            clientID: process.env.GOOGLE_CLIENT_ID,
            clientSecret: process.env.GOOGLE_CLIENT_SECRET,
            callbackURL: process.env.GOOGLE_CALLBACK_URL,
            scope: ['email', 'profile'],
        } as StrategyOptions);
    }

    async validate(
        accessToken: string,
        refreshToken: string,
        profile: GoogleProfile,
        done: VerifyCallback
    ): Promise<any> {
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

        const user = await this.googleAuthService.validateOAuthLogin(userInfo);
        done(null, user);
    }
}
