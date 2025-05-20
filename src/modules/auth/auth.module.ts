import { Module } from '@nestjs/common';
import { AuthService } from './services/auth.service';
import { AuthController } from './auth.controller';
import { UsersModule } from '@modules/users/users.module';
import { JwtModule } from '@nestjs/jwt';
import { ConfigModule, ConfigService } from '@nestjs/config';
import { GoogleStrategy } from 'src/modules/auth/strategies/google.strategy';
import { SignOutHandler } from './commands/handlers/signout.handler';
import { CqrsModule } from '@nestjs/cqrs';
import { JwtStrategy } from './strategies/jwt.strategy';
import { RegisterUserCommandHandler } from './commands/handlers/register-user.handler';
import { LoginHandler } from './queries/handlers/login.handler';
import { RefreshTokenHandler } from './queries/handlers/refresh-token.handler';
import { PassportModule } from '@nestjs/passport';

@Module({
  imports: [
    CqrsModule,
    UsersModule,
    PassportModule,
    JwtModule.registerAsync({
      imports: [ConfigModule],
      inject: [ConfigService],
      useFactory: (configService: ConfigService) => ({
        secret: configService.get<string>('JWT_SECRET'),
        signOptions: {
          expiresIn: configService.get<string>('JWT_EXPIRES_IN'),
        },
      }),
    }),
  ],
  providers: [AuthService, GoogleStrategy, RegisterUserCommandHandler, SignOutHandler, JwtStrategy, RefreshTokenHandler, LoginHandler],
  controllers: [AuthController],
  exports: [JwtStrategy],
})
export class AuthModule {}
