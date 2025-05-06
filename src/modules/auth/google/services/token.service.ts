import { Injectable } from '@nestjs/common';
import { JwtService } from '@nestjs/jwt';
import * as bcrypt from 'bcrypt';
import { User, Role } from '@prisma/client';
import { CONTENT_TYPES } from '@config/constants';
import { DatabaseService } from 'src/database/database.service';

type UserWithRole = User & { role: Role };

@Injectable()
export class TokenService {
  constructor(
    private readonly jwtService: JwtService,
    private readonly database: DatabaseService,
  ) {}

  async generateTokens(user: UserWithRole): Promise<[string, string]> {
    const payload = {
      sub: user.id,
      email: user.email,
      role: user.role.name,
      firstName: user.firstName,
      lastName: user.lastName,
      profilePicture: user.profilePicture,
    };

    const accessToken = await this.jwtService.signAsync(payload, {
      expiresIn: CONTENT_TYPES.ACCESS_TOKEN_EXPIRY,
    });

    const refreshToken = await this.jwtService.signAsync(payload, {
      expiresIn: CONTENT_TYPES.REFRESH_TOKEN_EXPIRY,
    });

    return [accessToken, refreshToken];
  }

  async updateRefreshToken(userId: string, refreshToken: string): Promise<void> {
    const hashedRefreshToken = await bcrypt.hash(refreshToken, 10);

    await this.database.user.update({
      where: { id: userId },
      data: { refreshToken: hashedRefreshToken },
    });
  }
}
