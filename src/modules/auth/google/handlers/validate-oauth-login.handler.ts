import { CommandHandler, ICommandHandler } from '@nestjs/cqrs';
import { ValidateOAuthLoginCommand } from 'src/modules/auth/google/commands/validate-oauth-login.command';
import { InternalServerErrorException } from '@nestjs/common';
import { TokenService } from 'src/modules/auth/google/services/token.service';
import { DatabaseService } from '@common/database/database.service';

@CommandHandler(ValidateOAuthLoginCommand)
export class ValidateOAuthLoginHandler implements ICommandHandler<ValidateOAuthLoginCommand> {
  constructor(
    private readonly database: DatabaseService,
    private readonly tokenService: TokenService,
  ) {}

  async execute(command: ValidateOAuthLoginCommand): Promise<any> {
    const { email, firstName, lastName, googleId, picture } = command;

    let user = await this.database.user.findUnique({
      where: { email },
      include: { role: true },
    });

    if (!user) {
      const defaultRole = await this.database.role.findFirst({
        where: { name: 'Content creator' },
      });

      if (!defaultRole) {
        throw new InternalServerErrorException('Default role Content Creator not found.');
      }

      user = await this.database.user.create({
        data: {
          email,
          firstName,
          lastName,
          googleId,
          profilePicture: picture,
          role: { connect: { id: defaultRole.id } },
        },
        include: { role: true },
      });
    }

    const [accessToken, refreshToken] = await this.tokenService.generateTokens(user);
    await this.tokenService.updateRefreshToken(user.id, refreshToken);

    return { user, accessToken, refreshToken };
  }
}
