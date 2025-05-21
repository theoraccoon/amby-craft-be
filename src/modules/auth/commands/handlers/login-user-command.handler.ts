import { QueryHandler, IQueryHandler } from '@nestjs/cqrs';
import { LoginUserCommand } from '../login-user.command';
import { DatabaseService } from '@common/database/database.service';
import { UnauthorizedException } from '@nestjs/common';
import { AUTH_LITERALS } from '@common/config/constants';
import { compare } from 'bcrypt';
import { TokenService } from '@modules/auth/services/token.service';

@QueryHandler(LoginUserCommand)
export class LoginUserCommandHandler implements IQueryHandler<LoginUserCommand> {
  constructor(
    private readonly databaseService: DatabaseService,
    private readonly tokenService: TokenService,
  ) {}

  async execute(command: LoginUserCommand) {
    const { loginUserRequest } = command;
    const { email, password } = loginUserRequest;

    const user = await this.databaseService.user.findUnique({
      where: { email },
      include: { role: true },
    });

    if (!user) {
      throw new UnauthorizedException(AUTH_LITERALS.WRONGCREDENTIALS);
    }

    const isPasswordValid = await compare(password, String(user.password));
    if (!isPasswordValid) {
      throw new UnauthorizedException(AUTH_LITERALS.INVALIDCREDENTIALS);
    }

    const tokens = await this.tokenService.generateAndStoreTokens(user?.id, user?.email);

    return { ...tokens, user };
  }
}
