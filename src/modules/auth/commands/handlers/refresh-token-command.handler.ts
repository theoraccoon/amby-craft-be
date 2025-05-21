import { DatabaseService } from '@common/database/database.service';
import { CommandHandler, ICommandHandler } from '@nestjs/cqrs';
import { RefreshTokenCommand } from '../refresh-token.command';
import { TokenService } from '@modules/auth/services/token.service';
import { UnauthorizedException } from '@nestjs/common';
import { AUTH_LITERALS } from '@common/config/constants';
import { compare } from 'bcrypt';

@CommandHandler(RefreshTokenCommand)
export class RefreshTokenCommandHandler implements ICommandHandler<RefreshTokenCommand> {
  constructor(
    private readonly databaseService: DatabaseService,
    private readonly tokenService: TokenService,
  ) {}

  async execute(command: RefreshTokenCommand): Promise<any> {
    const { userId, refreshToken } = command.refreshTokenRequest;

    if (!refreshToken) {
      throw new UnauthorizedException(AUTH_LITERALS.REFRESHTOKENMISSING);
    }

    try {
      const user = await this.databaseService.user.findUnique({
        where: { id: userId },
      });

      if (!user || !(AUTH_LITERALS.REFRESHTOKEN in user) || !(AUTH_LITERALS.REFRESHTOKENEXPIRY in user)) {
        throw new UnauthorizedException(AUTH_LITERALS.UNAUTHORIZEDEXCEPTION);
      }

      const isTokenValid = await compare(refreshToken, String(user.refreshToken));

      if (!isTokenValid) {
        throw new UnauthorizedException(AUTH_LITERALS.INVALIDREFRESHTOKENFROMDB);
      }

      const tokens = await this.tokenService.generateAndStoreTokens(user?.id, user?.email);

      return tokens;
    } catch (error: unknown) {
      const message = error instanceof Error ? error.message : 'Unknown error';
      throw new UnauthorizedException(AUTH_LITERALS.INVALIDREFRESHTOKEN, message);
    }
  }
}
