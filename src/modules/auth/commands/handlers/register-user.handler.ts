import { CommandHandler, ICommandHandler } from '@nestjs/cqrs';
import { RegisterUserCommand } from '../register-user.command';
import { AuthService } from '../../services/auth.service';
import { DatabaseService } from '@common/database/database.service';

@CommandHandler(RegisterUserCommand)
export class RegisterUserCommandHandler implements ICommandHandler<RegisterUserCommand> {
  constructor(
    private readonly authService: AuthService,
    private readonly databaseService: DatabaseService,
  ) {}

  async execute(command: RegisterUserCommand) {
    const { user } = command;
    const userExists = await this.databaseService.user.findUnique({
      where: { email: user.email },
    });

    if (userExists) {
      throw new Error('User already exists');
    }

    return await this.authService.validateUser(user);
  }
}
