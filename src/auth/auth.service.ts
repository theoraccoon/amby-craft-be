import { Injectable, UnauthorizedException } from '@nestjs/common';

import { UsersService } from 'src/users/users.service';
import { JwtService } from '@nestjs/jwt';
import { Response, Request } from 'express';
import * as bcrypt from 'bcrypt';
import { User } from '@prisma/client';
import { PrismaService } from '../prisma/prisma.service';
import { LoginDto } from './dto/login.dto';
import { CreateUserDto } from './dto/create-user.dto';
import { JwtPayload } from './types';

@Injectable()
export class AuthService {
    constructor(
        private readonly userService: UsersService,
        private readonly databaseService: PrismaService,
        private readonly jwtService: JwtService
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
            throw new UnauthorizedException('Refresh token missing');
        }

        try {
            const payload =
                await this.jwtService.verifyAsync<JwtPayload>(refreshToken);

            const user: User | null =
                await this.databaseService.user.findUnique({
                    where: { id: payload.userId },
                });

            if (
                !user ||
                !('refreshToken' in user) ||
                !('refreshTokenExpiry' in user)
            ) {
                throw new UnauthorizedException(
                    'User not found or no stored refresh token'
                );
            }

            const currentTime = new Date();
            if (user.refreshTokenExpiry! < currentTime) {
                throw new UnauthorizedException('Refresh token has expired');
            }

            const isTokenValid = await bcrypt.compare(
                refreshToken,
                String(user.refreshToken)
            );

            if (!isTokenValid) {
                throw new UnauthorizedException(
                    'Invalid refresh from db token'
                );
            }

            const { accessToken, refreshToken: newRefreshToken } =
                await this.generateToken(user.id);

            res.cookie('refreshToken', newRefreshToken, {
                httpOnly: true,
                secure: false,
                sameSite: 'lax',
                maxAge: 7 * 24 * 60 * 60 * 1000,
                path: '/api/v1/auth',
            });

            return { accessToken };
        } catch (error) {
            throw new UnauthorizedException(
                `Invalid refresh token ${error.message}`
            );
        }
    }

    // Method to validate user credentials and create a new user
    async validateUser(body: CreateUserDto) {
        return this.userService.create(body);
    }

    // Method to generate JWT tokens
    async generateToken(userId: string) {
        const accessToken = this.jwtService.sign(
            { userId },
            { expiresIn: '1h' }
        );
        const refreshToken = this.jwtService.sign(
            { userId },
            { expiresIn: '7d' }
        );

        await this.storeRefreshToken(userId, refreshToken);

        return { accessToken, refreshToken };
    }

    // Method to handle user login
    // It checks if the user exists and if the password is correct
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
            throw new UnauthorizedException('Wrong credentials provided');
        }

        const isPasswordValid = await this.userService.comparePassword(
            password,
            String(user.password)
        );

        if (!isPasswordValid) {
            throw new UnauthorizedException('Invalid credentials provided');
        }

        const {
            password: _,
            refreshToken: __,
            googleId: ___,
            roleId: ____,
            refreshTokenExpiry: _____,
            ...userWithoutSensitiveData
        } = user;

        const { accessToken, refreshToken } = await this.generateToken(
            userWithoutSensitiveData.id
        );

        response.cookie('refreshToken', refreshToken, {
            httpOnly: true,
            secure: false,
            sameSite: 'lax',
            maxAge: 7 * 24 * 60 * 60 * 1000,
            path: '/api/v1/auth',
        });

        return { ...userWithoutSensitiveData, accessToken: accessToken };
    }
}
