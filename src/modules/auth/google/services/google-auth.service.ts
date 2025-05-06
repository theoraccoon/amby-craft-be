import { Injectable } from '@nestjs/common';
import { CommandBus } from '@nestjs/cqrs';
import { ValidateOAuthLoginCommand } from 'src/modules/auth/google/commands/validate-oauth-login.command';

interface GoogleUserInfo {
  googleId: string;
  email: string;
  firstName: string;
  lastName: string;
  picture: string;
  accessToken: string;
  refreshToken: string;
}

@Injectable()
export class GoogleAuthService {
  constructor(private readonly commandBus: CommandBus) {}

  async validateOAuthLogin(userInfo: GoogleUserInfo) {
    const command = new ValidateOAuthLoginCommand(
      userInfo.googleId,
      userInfo.email,
      userInfo.firstName,
      userInfo.lastName,
      userInfo.picture,
      userInfo.accessToken,
      userInfo.refreshToken,
    );

    return this.commandBus.execute(command);
  }
}
