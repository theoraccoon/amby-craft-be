import { Body, Controller, Get, HttpCode, Post, Req, Res, UseGuards, ValidationPipe } from '@nestjs/common';
import { Response, Request } from 'express';
import { CreateUserDto } from 'src/modules/auth/dto/create-user.dto';
import { LoginDto } from 'src/modules/auth/dto/login.dto';
import { AuthService } from './services/auth.service';
import { CommandBus, QueryBus } from '@nestjs/cqrs';
import { RegisterCommand } from './commands/register.command';
import { JwtAuthGuard } from '../guards/jwt-auth.guard';
import { SignOutCommand } from './commands/signout.command';
import { LoginQuery } from './queries/login.query';

@Controller('auth')
export class AuthController {
  constructor(
    private readonly authService: AuthService,
    private commandBus: CommandBus,
    private queryBus: QueryBus,
  ) {}

  @Post('signup')
  async signup(@Body(ValidationPipe) body: CreateUserDto) {
    return this.commandBus.execute(new RegisterCommand(body));
  }

  @Get('refresh-token')
  async refreshToken(@Req() req: Request, @Res({ passthrough: true }) res: Response) {
    return this.authService.validateRefreshToken(req, res);
  }

  @Post('login')
  async login(@Res({ passthrough: true }) res: Response, @Body(ValidationPipe) body: LoginDto) {
    return this.queryBus.execute(new LoginQuery(body, res));
  }

  @UseGuards(JwtAuthGuard)
  @Post('sign-out')
  @HttpCode(204)
  async signOut(@Req() req, @Res() res: Response): Promise<void> {
    const user = req.user;
    await this.commandBus.execute(new SignOutCommand(user.userId));

    res.clearCookie('access_token');
    res.clearCookie('refresh_token');

    res.send();
  }
}
