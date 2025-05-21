import { Module } from '@nestjs/common';
import { AuthService } from './services/auth.service';
import { AuthController } from './auth.controller';
import { UsersModule } from '@modules/users/users.module';
import { JwtModule } from '@nestjs/jwt';
import { ConfigModule, ConfigService } from '@nestjs/config';
import { GoogleStrategy } from 'src/modules/auth/strategies/google.strategy';
import { GoogleAuthModule } from 'src/modules/auth/google/google-auth.module';
import { SignOutHandler } from './commands/handlers/signout.handler';
import { CqrsModule } from '@nestjs/cqrs';
import { JwtStrategy } from '../strategies/jwt.strategy';
import { RegisterHandler } from './commands/handlers/register.handler';
import { LoginHandler } from './queries/handlers/login.handler';
import { RefreshTokenHandler } from './queries/handlers/refresh-token.handler';

@Module({
  imports: [
    CqrsModule,
    UsersModule,
    CqrsModule,
    GoogleAuthModule,
    JwtModule.registerAsync({
      imports: [ConfigModule],
      useFactory: (configService: ConfigService) => ({
        secret: configService.get<string>('JWT_SECRET'),
      }),
      inject: [ConfigService],
    }),
  ],
  providers: [AuthService, GoogleStrategy, RegisterHandler, SignOutHandler, JwtStrategy, RefreshTokenHandler, LoginHandler],
  controllers: [AuthController],
  exports: [JwtStrategy],
})
export class AuthModule {}
