import { CommandHandler, ICommandHandler } from '@nestjs/cqrs';
import { JwtService } from '@nestjs/jwt';
import { GoogleAuthCommand } from '../google-auth.command';
import { DatabaseService } from '@common/database/database.service';
import { InternalServerErrorException } from '@nestjs/common';
import { ERRORS } from '@common/config/constants';

@CommandHandler(GoogleAuthCommand)
export class LoginWithGoogleCommandHandler implements ICommandHandler<GoogleAuthCommand> {
  constructor(
    private readonly databaseService: DatabaseService,
    private jwtService: JwtService,
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

    const user = await this.databaseService.user.findUnique({
      where: { email: userInfo.email },
    });

    if (!user) {
      const defaultRole = await this.databaseService.role.findFirst({
        where: { name: 'Content creator' },
      });

      if (!defaultRole) {
        throw new InternalServerErrorException(ERRORS.DEFAULT_ROLE_NOT_FOUND);
      }

      const newUser = await this.databaseService.user.create({
        data: {
          ...userInfo,
          role: { connect: { id: defaultRole.id } },
        },
        include: { role: true },
      });
      return this.jwtService.sign({ userId: newUser.id });
    }

    return this.jwtService.sign({ userId: user.id });
  }
}
