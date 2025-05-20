import { CommandHandler, ICommandHandler } from '@nestjs/cqrs';
import { SignOutCommand } from '../signout.command';
import { AuthService } from '../../services/auth.service';

@CommandHandler(SignOutCommand)
export class SignOutHandler implements ICommandHandler<SignOutCommand> {
  constructor(private readonly authService: AuthService) {}

  async execute(command: SignOutCommand): Promise<void> {
    const { userId } = command;
    if (!userId) {
      throw new Error('User ID is required for sign out');
    }
    // Invalidate the refresh token for the user
    // TODO:('Invalidate the refresh token for the user');

    await this.authService.invalidateRefreshToken(userId);
  }
}
