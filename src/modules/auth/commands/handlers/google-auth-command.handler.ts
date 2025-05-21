import { CommandBus, CommandHandler, ICommandHandler } from '@nestjs/cqrs';
import { GoogleAuthCommand } from '../google-auth.command';
import { DatabaseService } from '@common/database/database.service';
import { InternalServerErrorException } from '@nestjs/common';
import { ERRORS } from '@common/config/constants';
import { TokenService } from '@modules/auth/services/token.service';
import { CreateUserDto } from '@modules/auth/dto/create-user.dto';
import { RegisterUserCommand } from '../register-user.command';

@CommandHandler(GoogleAuthCommand)
export class GoogleAuthCommandHandler implements ICommandHandler<GoogleAuthCommand> {
  constructor(
    private readonly databaseService: DatabaseService,
    private readonly tokenService: TokenService,
    private readonly commandBus: CommandBus,
  ) {}

  async execute(command: GoogleAuthCommand) {
    const { googleProfile } = command;
    const { id, name, emails, photos } = googleProfile;

    if (!emails || !emails[0]) {
      throw new InternalServerErrorException(ERRORS.ERROR_GOOGLE_PROFILE_MISSING_EMAIL);
    }

    const userInfo = {
      googleId: id,
      email: emails[0].value || '',
      firstName: name?.givenName || '',
      lastName: name?.familyName || '',
      picture: photos?.[0]?.value || '',
    };

    try {
      let user = await this.databaseService.user.findUnique({
        where: { email: userInfo.email },
      });

      if (!user) {
        const createUserRequest: CreateUserDto = {
          ...userInfo,
          password: '',
        };
        user = await this.commandBus.execute(new RegisterUserCommand(createUserRequest));
      }

      const tokens = await this.tokenService.generateAndStoreTokens(String(user?.id), String(user?.email));
      return { ...tokens, user };
    } catch (error) {
      console.error('Error in GoogleAuthCommandHandler:', error);
      throw new InternalServerErrorException();
    }
  }
}
