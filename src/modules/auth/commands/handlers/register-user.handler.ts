import { CommandHandler, ICommandHandler } from '@nestjs/cqrs';
import { RegisterUserCommand } from '../register-user.command';
import { DatabaseService } from '@common/database/database.service';
import { ConflictException } from '@nestjs/common';
import { hash } from 'bcrypt';
import commonQuery from '@common/query/common.query';
import { TokenService } from '@modules/auth/services/token.service';

@CommandHandler(RegisterUserCommand)
export class RegisterUserCommandHandler implements ICommandHandler<RegisterUserCommand> {
  constructor(
    private readonly databaseService: DatabaseService,
    private readonly tokenService: TokenService,
  ) {}

  async execute(command: RegisterUserCommand) {
    const { user } = command;
    const userExists = await this.databaseService.user.findUnique({
      where: { email: user.email },
    });

    if (userExists) {
      throw new ConflictException('User with this email already exists');
    }

    const newUser = await this.databaseService.user.create({
      data: {
        ...user,
        password: await hash(user.password, 10),
        role: {
          connect: { identifier: 'user' },
        },
      },
      ...commonQuery,
    });

    const tokens = await this.tokenService.generateAndStoreTokens(newUser?.id, newUser?.email);
    return { ...tokens, user: newUser };
  }
}
