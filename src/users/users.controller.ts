import {
    Controller,
    Get,
    Body,
    Patch,
    Param,
    Delete,
    Query,
} from '@nestjs/common';
import { UsersService } from './users.service';
import { Prisma, User } from '@prisma/client';
import { ApiOperation, ApiQuery, ApiResponse } from '@nestjs/swagger';
import { ApiResponseDto } from 'src/common/dto/api-response.dto';
import { ApiResponseExample } from 'src/helper/api-response-example';

@Controller('users')
export class UsersController {
    constructor(private readonly usersService: UsersService) {}

    @ApiQuery({ name: 'role', enum: ['user', 'admin'], required: false })
    @Get()
    async findAll(@Query('role') role?: 'user' | 'admin'): Promise<User[]> {
        return this.usersService.findAll(role);
    }

    @ApiOperation({ summary: 'Get User' })
    @Get(':id')
    async findOne(@Param('id') id: string): Promise<User> {
        return this.usersService.findOne(id);
    }

    @ApiOperation({ summary: 'Update User' })
    @Patch(':id')
    async update(
        @Param('id') id: string,
        @Body() updateUserDto: Prisma.UserUpdateInput
    ): Promise<User> {
        return this.usersService.update(id, updateUserDto);
    }

    @ApiOperation({ summary: 'Delete User' })
    @ApiResponse({
        status: 200,
        description: 'User deleted successfully',
        schema: {
            example: ApiResponseExample.success(200, 'request successful'),
        },
        type: ApiResponseDto,
    })
    @Delete(':id')
    async remove(@Param('id') id: string): Promise<User> {
        return this.usersService.remove(id);
    }
}
