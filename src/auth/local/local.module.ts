import { Module } from '@nestjs/common';
import { AuthController } from './local.controller';
import { UsersModule } from 'src/users/users.module';
import { JwtModule } from '@nestjs/jwt';
import { ConfigModule, ConfigService } from '@nestjs/config';
import { CqrsModule } from '@nestjs/cqrs';
import { AuthService } from './local.service';
import { RegisterHandler } from './handlers/register.handler';
import { LoginHandler } from './handlers/login.handler';
import { RefreshTokenHandler } from './handlers/refresh-token.handler';

@Module({
  imports: [
    UsersModule,
    CqrsModule,
    ConfigModule,
    JwtModule.registerAsync({
      imports: [ConfigModule],
      useFactory: (configService: ConfigService) => ({
        secret: configService.get<string>('JWT_SECRET'),
      }),
      inject: [ConfigService],
    }),
  ],
  providers: [AuthService, RegisterHandler, LoginHandler, RefreshTokenHandler],
  controllers: [AuthController],
})
export class AuthModule {}
