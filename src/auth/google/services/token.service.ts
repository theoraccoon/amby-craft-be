import { Injectable } from '@nestjs/common';
import { JwtService } from '@nestjs/jwt';
import * as bcrypt from 'bcrypt';
import { PrismaService } from '@prisma/prisma.service';
import { User, Role } from '@prisma/client';

type UserWithRole = User & { role: Role };

@Injectable()
export class TokenService {
    constructor(
        private readonly jwtService: JwtService,
        private readonly prisma: PrismaService
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
            expiresIn: '1h',
        });

        const refreshToken = await this.jwtService.signAsync(payload, {
            expiresIn: '7d',
        });

        return [accessToken, refreshToken];
    }

    async updateRefreshToken(
        userId: string,
        refreshToken: string
    ): Promise<void> {
        const hashedRefreshToken = await bcrypt.hash(refreshToken, 10);

        await this.prisma.user.update({
            where: { id: userId },
            data: { refreshToken: hashedRefreshToken },
        });
    }
}
