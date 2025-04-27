import {
    BadRequestException,
    Injectable,
    NotFoundException,
} from '@nestjs/common';

import { UsersService } from 'src/users/users.service';
import { CreateUserDto } from './dto/create-user.dto';
import { LoginDto } from './dto/login.dto';
import { DatabaseService } from 'src/database/database.service';

@Injectable()
export class AuthService {
    constructor(
        private readonly userService: UsersService,
        private readonly databaseService: DatabaseService
    ) {}

    // Method to validate user credentials and create a new user
    async validateUser(body: CreateUserDto) {
        return this.userService.create(body);
    }

    // Method to handle user login
    // It checks if the user exists and if the password is correct
    async login(body: LoginDto) {
        const { email, password } = body;

        const user = await this.databaseService.user.findUnique({
            where: { email },
            include: {
                role: {
                    select: {
                        id: true,
                        name: true,
                        identifier: true,
                        description: true,
                    },
                },
            },
        });

        if (!user) {
            throw new NotFoundException('User not found');
        }

        const isPasswordValid = await this.userService.comparePassword(
            password,
            String(user.password)
        );

        if (!isPasswordValid) {
            throw new BadRequestException('Invalid password');
        }
        const {
            password: _,
            refreshToken: __,
            googleId: ___,
            roleId: ____,
            ...userWithoutSensitiveData
        } = user;

        // const {accessToken, refreshToken }= this.authService.generateToken(user.id);

        return userWithoutSensitiveData;
    }
}
