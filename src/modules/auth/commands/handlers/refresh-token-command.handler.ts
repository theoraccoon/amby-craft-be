import { DatabaseService } from '@common/database/database.service';
import { ForbiddenException, UnauthorizedException } from '@nestjs/common';
import { ConfigService } from '@nestjs/config';
import { CommandHandler, ICommandHandler } from '@nestjs/cqrs';
import { JwtService } from '@nestjs/jwt';
import { RefreshTokenCommand } from '../refresh-token.command';
import { CONTENT_TYPES } from '@common/config/constants';
import { hash } from 'bcryptjs';
import { TokenPayload } from '@modules/auth/types';
import { compare } from 'bcrypt';

@CommandHandler(RefreshTokenCommand)
export class RefreshTokenCommandHandler implements ICommandHandler<RefreshTokenCommand> {
  constructor(
    private readonly databaseService: DatabaseService,
    private readonly jwtService: JwtService,
    private readonly configService: ConfigService,
  ) {}

  async execute(command: RefreshTokenCommand): Promise<any> {
    const { userId, refreshToken } = command;

    const user = await this.verifyUserRefreshToken(userId, refreshToken);
    if (!user) {
      throw new UnauthorizedException('Invalid or expired refresh token');
    }

    return await this.generateToken(userId);
  }

  async generateToken(userId: string) {
    const tokenPayload: TokenPayload = {
      userId: hash(userId),
    };

    const accessToken = this.jwtService.sign(tokenPayload, { expiresIn: CONTENT_TYPES.ACCESS_TOKEN_EXPIRY });
    const newRefreshToken = this.jwtService.sign(tokenPayload, { expiresIn: CONTENT_TYPES.REFRESH_TOKEN_EXPIRY });

    await this.storeRefreshToken(userId, newRefreshToken);

    return { accessToken, newRefreshToken };
  }

  async storeRefreshToken(userId: string, refreshToken: string) {
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

  async verifyUserRefreshToken(userId: string, refreshToken: string) {
    try {
      const user = await this.databaseService.user.findUnique({
        where: { id: userId },
      });

      if (!user || !user.refreshToken || !user.refreshTokenExpiry) {
        throw new ForbiddenException('Invalid or expired refresh token');
      }

      const isAuthenticated = await compare(refreshToken, user?.refreshToken);
      if (!isAuthenticated) {
        throw new UnauthorizedException();
      }

      return user;
    } catch {
      throw new ForbiddenException('Invalid or expired refresh token');
    }
  }
}
