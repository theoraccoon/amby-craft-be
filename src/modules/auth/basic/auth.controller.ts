import { Body, Controller, Get, HttpCode, Post, Req, Res, UseGuards, ValidationPipe } from '@nestjs/common';
import { Response, Request } from 'express';
import { CreateUserDto } from 'src/modules/auth/dto/create-user.dto';
import { LoginDto } from 'src/modules/auth/dto/login.dto';
import { AuthService } from './auth.service';
import { JwtAuthGuard } from '../guards/jwt-auth.guard';
import { CommandBus } from '@nestjs/cqrs';
import { SignOutCommand } from './commands/signout.command';

@Controller('auth')
export class AuthController {
  constructor(
    private readonly authService: AuthService,
    private readonly commandBus: CommandBus,
  ) {}

  @Post('signup')
  async signup(@Body(ValidationPipe) body: CreateUserDto) {
    return this.authService.validateUser(body);
  }

  @UseGuards(JwtAuthGuard)
  @Get('refresh-token')
  async refreshToken(@Req() req: Request, @Res({ passthrough: true }) res: Response) {
    return this.authService.validateRefreshToken(req, res);
  }

  @Post('login')
  async login(@Res({ passthrough: true }) response: Response, @Body(ValidationPipe) body: LoginDto) {
    return this.authService.login(body, response);
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
