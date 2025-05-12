import { CommandHandler, ICommandHandler } from '@nestjs/cqrs';
import { SignOutCommand } from '../commands/signout.command';
import { AuthService } from '../auth.service';

@CommandHandler(SignOutCommand)
export class SignOutHandler implements ICommandHandler<SignOutCommand> {
  constructor(private readonly authService: AuthService) {}

  async execute(command: SignOutCommand): Promise<void> {
    await this.authService.invalidateRefreshToken(command.userId);
  }
}
