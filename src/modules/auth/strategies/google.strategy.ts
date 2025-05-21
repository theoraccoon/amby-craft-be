import { Injectable, UnauthorizedException, Logger } from '@nestjs/common'; // Import Logger
import { PassportStrategy } from '@nestjs/passport';
import { Strategy, Profile as GoogleProfile, VerifyCallback } from 'passport-google-oauth20'; // Import VerifyCallback
import { ConfigService } from '@nestjs/config';
import { CommandBus } from '@nestjs/cqrs';
import { GoogleAuthCommand } from '../commands/google-auth.command';

@Injectable()
export class GoogleStrategy extends PassportStrategy(Strategy) {
  private readonly logger = new Logger(GoogleStrategy.name);

  constructor(
    configService: ConfigService,
    private readonly commandBus: CommandBus,
  ) {
    const scopesFromEnv = configService
      .get<string>('GOOGLE_AUTH_SCOPES', 'profile,email')
      .split(',')
      .map(s => s.trim());

    super({
      clientID: configService.get<string>('GOOGLE_CLIENT_ID') || '',
      clientSecret: configService.get<string>('GOOGLE_CLIENT_SECRET') || '',
      callbackURL: configService.get<string>('GOOGLE_CALLBACK_URL'),
      scope: scopesFromEnv,
    });
  }

  async validate(accessToken: string, refreshToken: string, profile: GoogleProfile, done: VerifyCallback): Promise<void> {
    try {
      const result = await this.commandBus.execute(new GoogleAuthCommand(profile));

      done(null, result);
    } catch (error) {
      this.logger.error(`GoogleStrategy validation failed: ${error.message}`, error.stack);
      done(new UnauthorizedException('Google authentication failed'), false);
    }
  }
}
