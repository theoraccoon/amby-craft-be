import { CreateUserDto } from 'src/auth/dto/create-user.dto';

export class RegisterCommand {
  constructor(public readonly user: CreateUserDto) {}
}
