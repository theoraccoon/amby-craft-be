import { LoginDto } from '@modules/auth/dto/login.dto';
import { Response } from 'express';

export class LoginQuery {
  constructor(
    public readonly body: LoginDto,
    public readonly response: Response,
  ) {}
}
