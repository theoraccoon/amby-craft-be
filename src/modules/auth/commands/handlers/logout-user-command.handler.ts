import { CommandHandler, ICommandHandler } from '@nestjs/cqrs';
import { LogoutUserCommand } from '../logout-user.command';
import { TokenService } from '@modules/auth/services/token.service';

@CommandHandler(LogoutUserCommand)
export class LogoutUserCommandHandler implements ICommandHandler<LogoutUserCommand> {
  constructor(private readonly tokenService: TokenService) {}

  async execute(command: LogoutUserCommand): Promise<void> {
    const { userId } = command;
    if (!userId) {
      throw new Error('User ID is required for sign out');
    }

    await this.tokenService.removeRefreshToken(userId);
  }
}
