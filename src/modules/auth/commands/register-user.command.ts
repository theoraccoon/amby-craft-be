import { CreateUserDto } from '@modules/auth/dto/create-user.dto';

export class RegisterUserCommand {
  constructor(public readonly user: CreateUserDto) {}
}
