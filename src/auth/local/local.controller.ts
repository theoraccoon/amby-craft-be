import { Body, Controller, Get, Post, Req, Res, ValidationPipe } from '@nestjs/common';
import { Response, Request } from 'express';
import { CommandBus, QueryBus } from '@nestjs/cqrs';
import { AuthService } from './local.service';
import { CreateUserDto } from '../dto/create-user.dto';
import { RegisterCommand } from './commands/register.command';
import { refreshTokenQuery } from './queries/refresh-token';
import { LoginDto } from '../dto/login.dto';
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
    return this.queryBus.execute(new refreshTokenQuery(req, res));
  }

  @Post('login')
  async login(@Res({ passthrough: true }) res: Response, @Body(ValidationPipe) body: LoginDto) {
    return this.queryBus.execute(new LoginQuery(body, res));
  }
}
