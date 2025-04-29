import { CommandHandler, ICommandHandler } from '@nestjs/cqrs';
import { ValidateOAuthLoginCommand } from '@google/commands/validate-oauth-login.command';
import { PrismaService } from '@prisma/prisma.service';
import { InternalServerErrorException } from '@nestjs/common';
import { TokenService } from '@google/services/token.service';

@CommandHandler(ValidateOAuthLoginCommand)
export class ValidateOAuthLoginHandler implements ICommandHandler<ValidateOAuthLoginCommand> {
  constructor(
    private readonly prisma: PrismaService,
    private readonly tokenService: TokenService,
  ) {}

  async execute(command: ValidateOAuthLoginCommand): Promise<any> {
    const { email, firstName, lastName, googleId, picture } = command;

    let user = await this.prisma.user.findUnique({
      where: { email },
      include: { role: true },
    });

    if (!user) {
      const defaultRole = await this.prisma.role.findFirst({
        where: { name: 'Content creator' },
      });

      if (!defaultRole) {
        throw new InternalServerErrorException('Default role Content Creator not found.');
      }

      user = await this.prisma.user.create({
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
