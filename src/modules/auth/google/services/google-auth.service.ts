import { Injectable } from '@nestjs/common';
import { CommandBus } from '@nestjs/cqrs';
import { ValidateOAuthLoginCommand } from 'src/modules/auth/google/commands/validate-oauth-login.command';
import { InternalServerErrorException } from '@nestjs/common';
import { ERRORS } from '@common/config/constants';

export interface GoogleUserInfo {
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
    try {
      const command = new ValidateOAuthLoginCommand(
        userInfo.googleId,
        userInfo.email,
        userInfo.firstName,
        userInfo.lastName,
        userInfo.picture,
        userInfo.accessToken,
        userInfo.refreshToken,
      );

      const result = await this.commandBus.execute(command);

      if (!result) {
        throw new InternalServerErrorException(ERRORS.ERROR_VALIDATING_OAUTH_LOGIN);
      }

      return result;
    } catch (error) {
      throw new InternalServerErrorException(error.message || ERRORS.INTERNAL_SERVER_ERROR);
    }
  }
}
