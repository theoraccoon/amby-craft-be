import { CommandHandler, ICommandHandler } from '@nestjs/cqrs';
import { SignOutCommand } from '../signout.command';
import { TokenService } from '@modules/auth/services/token.service';

@CommandHandler(SignOutCommand)
export class SignOutHandler implements ICommandHandler<SignOutCommand> {
  constructor(private readonly tokenService: TokenService) {}

  async execute(command: SignOutCommand): Promise<void> {
    const { userId } = command;
    if (!userId) {
      throw new Error('User ID is required for sign out');
    }

    await this.tokenService.removeRefreshToken(userId);
  }
}
