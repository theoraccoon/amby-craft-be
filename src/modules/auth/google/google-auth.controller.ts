import { Controller, Get, UseGuards, Req } from '@nestjs/common';
import { AuthGuard } from '@nestjs/passport';
import { ApiTags } from '@nestjs/swagger';
import { Request } from 'express';
import { API_CONSTANTS, CONTENT_TYPES } from '@common/config/constants';

@ApiTags(API_CONSTANTS.GOOGLE_API_TAG)
@Controller()
export class GoogleAuthController {
  constructor() {}

  @Get(API_CONSTANTS.GOOGLE_AUTH)
  @UseGuards(AuthGuard(API_CONSTANTS.GOOGLE))
  async googleAuth() {}

  @Get(API_CONSTANTS.GOOGLE_AUTH_CALLBACK)
  @UseGuards(AuthGuard(API_CONSTANTS.GOOGLE))
  googleAuthRedirect(@Req() req: RequestWithUser) {
    const { user } = req;

    if (!user) {
      throw new Error(CONTENT_TYPES.USER_NOT_FOUND);
    }

    return {
      message: CONTENT_TYPES.USER_INFO,
      ...user,
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
  refreshToken: string;
  accessToken: string;
}

interface RequestWithUser extends Request {
  user: GoogleUser;
}
