import { Controller, Get, UseGuards, Req } from '@nestjs/common';
import { AuthGuard } from '@nestjs/passport';
import { GoogleAuthService } from '@google/services/google-auth.service';
import { ApiTags } from '@nestjs/swagger';
import { Request } from 'express';

@ApiTags('Google Auth')
@Controller()
export class GoogleAuthController {
    constructor(private readonly googleAuthService: GoogleAuthService) {}

    @Get('auth/google')
    @UseGuards(AuthGuard('google'))
    async googleAuth() {}

    @Get('auth/google/callback')
    @UseGuards(AuthGuard('google'))
    googleAuthRedirect(@Req() req: RequestWithUser) {
        const { user } = req;

        if (!user) {
            throw new Error('User not found');
        }

        return {
            message: 'User Info',
            user,
        };
    }
}

interface GoogleUser {
    id: string;
    email: string;
    firstName: string;
    lastName: string;
    profilePicture: string;
    role: string;
}

interface RequestWithUser extends Request {
    user: GoogleUser;
}
