import { Response } from 'express';
import { LoginDto } from 'src/auth/dto/login.dto';

export class LoginQuery {
  constructor(
    public readonly body: LoginDto,
    public readonly response: Response,
  ) {}
}
