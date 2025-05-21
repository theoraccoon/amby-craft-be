import { LoginDto } from '@modules/auth/dto/login.dto';

export class LoginUserCommand {
  constructor(public readonly loginUserRequest: LoginDto) {}
}
