import { Injectable } from '@nestjs/common';
import { JwtService } from '@nestjs/jwt';
import { ConfigService } from '@nestjs/config';
import { DatabaseService } from '@common/database/database.service';
import { compare, hash } from 'bcrypt';
import { CONTENT_TYPES } from '@common/config/constants';

interface Tokens {
  accessToken: string;
  refreshToken: string;
}

@Injectable()
export class TokenService {
  constructor(
    private readonly jwtService: JwtService,
    private readonly databaseService: DatabaseService,
    private readonly configService: ConfigService,
  ) {}

  async generateAndStoreTokens(userId: string, email: string): Promise<Tokens> {
    const payload = { sub: userId, email: email };

    const accessToken = await this.jwtService.signAsync(payload, { expiresIn: CONTENT_TYPES.ACCESS_TOKEN_EXPIRY });
    const refreshToken = await this.jwtService.signAsync(payload, { expiresIn: CONTENT_TYPES.REFRESH_TOKEN_EXPIRY });

    await this.storeRefreshToken(userId, refreshToken);

    return { accessToken, refreshToken };
  }

  async storeRefreshToken(userId: string, refreshToken: string): Promise<void> {
    const hashedToken = await hash(refreshToken, 10);
    const expiryDate = new Date();
    expiryDate.setDate(expiryDate.getDate() + 7);

    await this.databaseService.user.update({
      where: { id: userId },
      data: {
        refreshToken: hashedToken,
        refreshTokenExpiry: expiryDate,
      },
    });
  }

  async compareRefreshTokens(rawToken: string, hashedToken: string): Promise<boolean> {
    return compare(rawToken, hashedToken);
  }

  async removeRefreshToken(userId: string): Promise<void> {
    await this.databaseService.user.update({
      where: { id: userId },
      data: {
        refreshToken: null,
        refreshTokenExpiry: null,
      },
    });
  }
}
