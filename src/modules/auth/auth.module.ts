import { Module } from '@nestjs/common';
import { AuthController } from './auth.controller';
import { UsersModule } from '@modules/users/users.module';
import { JwtModule } from '@nestjs/jwt';
import { ConfigModule, ConfigService } from '@nestjs/config';
import { GoogleStrategy } from 'src/modules/auth/strategies/google.strategy';
import { CqrsModule } from '@nestjs/cqrs';
import { JwtStrategy } from './strategies/jwt.strategy';
import { PassportModule } from '@nestjs/passport';
import { TokenService } from './services/token.service';
import { AuthCommandHandlers } from './commands/handlers';

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
  providers: [TokenService, GoogleStrategy, JwtStrategy, ...AuthCommandHandlers],
  controllers: [AuthController],
  exports: [JwtStrategy],
})
export class AuthModule {}
