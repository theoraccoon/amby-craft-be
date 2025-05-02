import { Injectable } from '@nestjs/common';
import { UsersService } from 'src/users/users.service';
import { CreateUserDto } from './dto/create-user.dto';

@Injectable()
export class AuthService {
  constructor(private readonly userService: UsersService) {}

  // Method to validate user credentials and create a new user
  async validateUser(body: CreateUserDto) {
    return this.userService.create(body);
  }
}
