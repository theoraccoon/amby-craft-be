import { Injectable, InternalServerErrorException } from '@nestjs/common';
import { PrismaService } from '../../prisma/prisma.service';
import { JwtService } from '@nestjs/jwt';
import * as bcrypt from 'bcrypt';
import { User, Role } from '@prisma/client';

interface GoogleUserInfo {
    email: string;
    firstName: string;
    lastName: string;
    picture: string;
    googleId: string;
}

type UserWithRole = User & { role: Role };

@Injectable()
export class GoogleAuthService {
    constructor(
        private readonly prisma: PrismaService,
        private readonly jwtService: JwtService
    ) {}

    async validateOAuthLogin(userInfo: GoogleUserInfo) {
        const { email, firstName, lastName, picture, googleId } = userInfo;

        let user: UserWithRole | null = await this.prisma.user.findUnique({
            where: { email },
            include: { role: true },
        });

        if (!user) {
            const contentCreatorRole = await this.prisma.role.findFirst({
                where: { name: 'Content creator' },
            });

            if (!contentCreatorRole) {
                throw new InternalServerErrorException(
                    'Default role Content Creator not found.'
                );
            }

            user = await this.prisma.user.create({
                data: {
                    email,
                    firstName,
                    lastName,
                    googleId,
                    profilePicture: picture,
                    role: {
                        connect: { id: contentCreatorRole.id },
                    },
                },
                include: { role: true },
            });
        }

        const [accessToken, refreshToken] = await this.generateTokens(user);

        await this.updateRefreshToken(user.id, refreshToken);

        return { user, accessToken, refreshToken };
    }

    private async generateTokens(
        user: UserWithRole
    ): Promise<[string, string]> {
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

    private async updateRefreshToken(
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
