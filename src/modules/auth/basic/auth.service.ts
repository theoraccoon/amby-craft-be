import { Injectable, UnauthorizedException } from '@nestjs/common';

import { UsersService } from '@modules/users/users.service';
import { JwtService } from '@nestjs/jwt';
import { Response, Request } from 'express';
import * as bcrypt from 'bcrypt';
import { DatabaseService } from '@common/database/database.service';
import { LoginDto } from 'src/modules/auth/dto/login.dto';
import { CreateUserDto } from 'src/modules/auth/dto/create-user.dto';
import { JwtPayload } from 'src/modules/auth/types/index';
import { API_CONSTANTS, AUTH_LITERALS, CONTENT_TYPES } from '@common/config/constants';
import { ConfigService } from '@nestjs/config';

@Injectable()
export class AuthService {
  constructor(
    private readonly userService: UsersService,
    private readonly databaseService: DatabaseService,
    private readonly jwtService: JwtService,
    private readonly configService: ConfigService,
  ) {}

  // Method to store refresh token in the database
  async storeRefreshToken(userId: string, refreshToken: string) {
    const hashedToken = await bcrypt.hash(refreshToken, 10);

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

  async validateRefreshToken(req: Request, res: Response) {
    const cookies = req.cookies as { refreshToken?: string };
    const refreshToken = cookies.refreshToken;

    if (!refreshToken) {
      throw new UnauthorizedException(AUTH_LITERALS.REFRESHTOKENMISSING);
    }

    try {
      const payload = await this.jwtService.verifyAsync<JwtPayload>(refreshToken);

      const user = await this.databaseService.user.findUnique({
        where: { id: payload.userId },
      });

      if (!user || !(AUTH_LITERALS.REFRESHTOKEN in user) || !(AUTH_LITERALS.REFRESHTOKENEXPIRY in user)) {
        throw new UnauthorizedException(AUTH_LITERALS.UNAUTHORIZEDEXCEPTION);
      }

      const currentTime = new Date();
      if (user.refreshTokenExpiry! < currentTime) {
        throw new UnauthorizedException(AUTH_LITERALS.REFRESHTOKENEXPIRED);
      }

      const isTokenValid = await bcrypt.compare(refreshToken, String(user.refreshToken));

      if (!isTokenValid) {
        throw new UnauthorizedException(AUTH_LITERALS.INVALIDREFRESHTOKENFROMDB);
      }

      const { accessToken, refreshToken: newRefreshToken } = await this.generateToken(user.id);

      res.cookie(AUTH_LITERALS.REFRESHTOKEN, newRefreshToken, {
        httpOnly: true,
        secure: false,
        sameSite: 'lax',
        maxAge: this.configService.get<number>('REFRESH_TOKEN_MAX_AGE') || 0,
        path: API_CONSTANTS.PATH,
      });

      return { accessToken };
    } catch (error: unknown) {
      const message = error instanceof Error ? error.message : 'Unknown error';
      throw new UnauthorizedException(AUTH_LITERALS.INVALIDREFRESHTOKEN, message);
    }
  }

  // Method to validate user credentials and create a new user
  async validateUser(body: CreateUserDto) {
    return this.userService.create(body);
  }

  // Method to generate JWT tokens
  async generateToken(userId: string) {
    const accessToken = this.jwtService.sign({ userId }, { expiresIn: CONTENT_TYPES.ACCESS_TOKEN_EXPIRY });
    const refreshToken = this.jwtService.sign({ userId }, { expiresIn: CONTENT_TYPES.REFRESH_TOKEN_EXPIRY });

    await this.storeRefreshToken(userId, refreshToken);

    return { accessToken, refreshToken };
  }

  // Method to handle user login
  async login(body: LoginDto, response: Response): Promise<any> {
    const email = body.email;
    const password = body.password;

    const user = await this.databaseService.user.findUnique({
      where: { email },
      include: {
        role: {
          select: {
            id: true,
            name: true,
            identifier: true,
            description: true,
          },
        },
      },
    });

    if (!user) {
      throw new UnauthorizedException(AUTH_LITERALS.WRONGCREDENTIALS);
    }

    const isPasswordValid = await this.userService.comparePassword(password, String(user.password));

    if (!isPasswordValid) {
      throw new UnauthorizedException(AUTH_LITERALS.INVALIDCREDENTIALS);
    }

    const { password: _, refreshToken: __, googleId: ___, roleId: ____, refreshTokenExpiry: _____, ...userWithoutSensitiveData } = user;

    const { accessToken, refreshToken } = await this.generateToken(userWithoutSensitiveData.id);

    response.cookie(AUTH_LITERALS.REFRESHTOKEN, refreshToken, {
      httpOnly: true,
      secure: false,
      sameSite: 'lax',
      maxAge: this.configService.get<number>('REFRESH_TOKEN_MAX_AGE') || 0,
      path: API_CONSTANTS.PATH,
    });

    return { ...userWithoutSensitiveData, accessToken: accessToken };
  }

  async invalidateRefreshToken(userId: string): Promise<void> {
    await this.databaseService.user.update({
      where: { id: userId },
      data: { refreshToken: null },
    });
  }
}
