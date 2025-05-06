import { Module } from '@nestjs/common';
import { GoogleAuthController } from 'src/modules/auth/google/google-auth.controller';
import { GoogleAuthService } from 'src/modules/auth/google/services/google-auth.service';
import { TokenService } from 'src/modules/auth/google/services/token.service';
import { ValidateOAuthLoginHandler } from 'src/modules/auth/google/handlers/validate-oauth-login.handler';
import { CqrsModule } from '@nestjs/cqrs';
import { PassportModule } from '@nestjs/passport';
import { JwtModule } from '@nestjs/jwt';
import { DatabaseService } from '@database/database.service';
import { CONTENT_TYPES } from 'src/config/constants';
import { ConfigModule, ConfigService } from '@nestjs/config';

@Module({
  imports: [
    ConfigModule,
    PassportModule,
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
  providers: [GoogleAuthService, TokenService, DatabaseService, ValidateOAuthLoginHandler],
  exports: [GoogleAuthService],
})
export class GoogleAuthModule {}
