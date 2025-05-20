import { Injectable } from '@nestjs/common';
import { PassportStrategy } from '@nestjs/passport';
import { Strategy, Profile as GoogleProfile } from 'passport-google-oauth20';
import { TEXTS } from '@common/config/constants';
import { ConfigService } from '@nestjs/config';
import { CommandBus } from '@nestjs/cqrs';
import { GoogleAuthCommand } from '../commands/google-auth.command';

@Injectable()
export class GoogleStrategy extends PassportStrategy(Strategy) {
  constructor(
    configService: ConfigService,
    private commandBus: CommandBus,
  ) {
    super({
      clientID: configService.get<string>('GOOGLE_CLIENT_ID') || '',
      clientSecret: configService.get<string>('GOOGLE_CLIENT_SECRET') || '',
      callbackURL: configService.get<string>('GOOGLE_CALLBACK_URL'),
      scope: [TEXTS.EMAIL, TEXTS.PROFILE],
    });
  }

  async validate(accessToken: string, refreshToken: string, profile: GoogleProfile) {
    return this.commandBus.execute(new GoogleAuthCommand(profile));
  }
}
