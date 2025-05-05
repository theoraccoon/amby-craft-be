import { Module } from '@nestjs/common';
import { GoogleAuthController } from '@google/google-auth.controller';
import { GoogleStrategy } from '@strategies/google.strategy';
import { GoogleAuthService } from '@google/services/google-auth.service';
import { TokenService } from '@google/services/token.service';
import { ValidateOAuthLoginHandler } from '@google/handlers/validate-oauth-login.handler';
import { CqrsModule } from '@nestjs/cqrs';
import { PassportModule } from '@nestjs/passport';
import { JwtModule } from '@nestjs/jwt';
import { CONTENT_TYPES } from 'src/config/constants';
import { ConfigModule, ConfigService } from '@nestjs/config';

@Module({
  imports: [
    PassportModule,
    ConfigModule,
    CqrsModule,
    JwtModule.registerAsync({
      imports: [ConfigModule],
      useFactory: (configService: ConfigService) => ({
        secret: configService.get<string>('JWT_SECRET'),
        signOptions: {
          expiresIn: configService.get<string>(CONTENT_TYPES.ACCESS_TOKEN_EXPIRY),
        },
      }),
      inject: [ConfigService],
    }),
  ],
  controllers: [GoogleAuthController],
  providers: [GoogleStrategy, GoogleAuthService, TokenService, ValidateOAuthLoginHandler],
})
export class GoogleAuthModule {}
