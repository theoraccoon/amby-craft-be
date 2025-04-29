import { Module } from '@nestjs/common';
import { GoogleAuthController } from '@google/google-auth.controller';
import { GoogleStrategy } from '@strategies/google.strategy';
import { GoogleAuthService } from '@google/services/google-auth.service';
import { TokenService } from '@google/services/token.service';
import { ValidateOAuthLoginHandler } from '@google/handlers/validate-oauth-login.handler';
import { CqrsModule } from '@nestjs/cqrs';
import { PassportModule } from '@nestjs/passport';
import { JwtModule } from '@nestjs/jwt';
import { PrismaService } from '@prisma/prisma.service';
import { CONTENT_TYPES } from 'src/config/constants';

@Module({
    imports: [
        PassportModule,
        CqrsModule,
        JwtModule.register({
            secret: process.env.JWT_SECRET,
            signOptions: { expiresIn: CONTENT_TYPES.ACCESS_TOKEN_EXPIRY },
        }),
    ],
    controllers: [GoogleAuthController],
    providers: [
        GoogleStrategy,
        GoogleAuthService,
        TokenService,
        PrismaService,
        ValidateOAuthLoginHandler,
    ],
})
export class GoogleAuthModule {}
