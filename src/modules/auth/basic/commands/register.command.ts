import { CreateUserDto } from '@modules/auth/dto/create-user.dto';

export class RegisterCommand {
  constructor(public readonly user: CreateUserDto) {}
}
