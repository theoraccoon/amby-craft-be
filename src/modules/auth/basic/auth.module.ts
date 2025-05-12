import { Module } from '@nestjs/common';
import { AuthService } from './services/auth.service';
import { AuthController } from './auth.controller';
import { UsersModule } from '@modules/users/users.module';
import { JwtModule } from '@nestjs/jwt';
import { ConfigModule, ConfigService } from '@nestjs/config';
import { GoogleStrategy } from 'src/modules/auth/strategies/google.strategy';
import { GoogleAuthModule } from 'src/modules/auth/google/google-auth.module';
import { CqrsModule } from '@nestjs/cqrs';
import { RegisterHandler } from './handlers/register.handler';

@Module({
  imports: [
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
  providers: [AuthService, GoogleStrategy, RegisterHandler],
  controllers: [AuthController],
})
export class AuthModule {}
