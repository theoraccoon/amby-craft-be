import { BadRequestException, Injectable, NotFoundException } from '@nestjs/common';
import * as bcrypt from 'bcrypt';
import { Prisma, User } from '@prisma/client';
import { PrismaClientKnownRequestError } from '@prisma/client/runtime/library';
import { CreateUserDto } from 'src/auth/dto/create-user.dto';
import commonQuery from 'src/common/query/common.query';
import { DatabaseService } from '@database/database.service';

@Injectable()
export class UsersService {
  constructor(private readonly databaseService: DatabaseService) {}

  async create(createUserDto: CreateUserDto): Promise<User> {
    const { email, password } = createUserDto;

    const existingUser = await this.databaseService.user.findUnique({
      where: { email },
    });

    if (existingUser) {
      throw new BadRequestException('User with this email already exists');
    }

    return await this.databaseService.user.create({
      data: {
        ...createUserDto,
        password: await bcrypt.hash(password, 10),
        role: {
          connect: { identifier: 'user' },
        },
      },
      ...commonQuery,
    });
  }

  async findAll(role?: 'user' | 'admin'): Promise<User[]> {
    const allowedRoles = ['user', 'admin'] as const;

    if (role) {
      if (!allowedRoles.includes(role)) {
        throw new BadRequestException('Invalid role specified');
      }

      return await this.databaseService.user.findMany({
        where: {
          role: {
            identifier: role,
          },
        },
        ...commonQuery,
      });
    }

    return await this.databaseService.user.findMany({
      ...commonQuery,
    });
  }

  async findOne(id: string): Promise<User> {
    const user = await this.databaseService.user.findUnique({
      where: { id },
      ...commonQuery,
    });

    if (!user) {
      throw new NotFoundException('User not found');
    }

    return user;
  }

  async update(id: string, updateUserDto: Prisma.UserUpdateInput): Promise<User> {
    try {
      return await this.databaseService.user.update({
        where: { id },
        data: updateUserDto,
        ...commonQuery,
      });
    } catch (error) {
      if (error instanceof PrismaClientKnownRequestError && error.code === 'P2025') {
        throw new NotFoundException(`User with ID ${id} not found`);
      }
      throw error;
    }
  }

  async remove(id: string): Promise<User> {
    try {
      return await this.databaseService.user.delete({
        where: { id },
        ...commonQuery,
      });
    } catch (error) {
      if (error instanceof PrismaClientKnownRequestError && error.code === 'P2025') {
        throw new NotFoundException(`User with ID ${id} not found`);
      }
      throw error;
    }
  }

  async comparePassword(password: string, hashedPassword: string): Promise<boolean> {
    if (!password || !hashedPassword) {
      throw new BadRequestException('Password and hashed password are required');
    }

    return await bcrypt.compare(password, hashedPassword);
  }
}
