import { Injectable } from '@nestjs/common';
import { PassportStrategy } from '@nestjs/passport';
import { ExtractJwt, Strategy } from 'passport-jwt';
import { ConfigService } from '@nestjs/config';
import type { EnvConfig } from '@config/config.schema';
import { AUTH_LITERALS } from '@common/config/constants';

export interface JwtPayload {
  sub: string;
  email: string;
  role: string;
}

interface RequestWithCookies extends Request {
  cookies: {
    accessToken?: string;
    [key: string]: any;
  };
}

@Injectable()
export class JwtStrategy extends PassportStrategy(Strategy) {
  constructor(configService: ConfigService<EnvConfig>) {
    const secret = configService.get<string>('JWT_SECRET');

    if (!secret) {
      throw new Error(AUTH_LITERALS.JWT_SECRET_NOT_FOUND);
    }
    super({
      jwtFromRequest: ExtractJwt.fromExtractors([(req: RequestWithCookies) => req?.cookies?.accessToken, ExtractJwt.fromAuthHeaderAsBearerToken()]),
      ignoreExpiration: false,
      secretOrKey: secret,
    });
  }

  async validate(payload: JwtPayload) {
    return {
      userId: payload.sub,
      email: payload.email,
      role: payload.role,
    };
  }
}
