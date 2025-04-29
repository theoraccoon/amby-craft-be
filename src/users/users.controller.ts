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
import { ApiResponseExample } from 'src/helper/api-response-example';
import { ApiResponseDto } from 'src/common/dto/api-response.dto';

@Controller('users')
export class UsersController {
    constructor(private readonly usersService: UsersService) {}

    @ApiOperation({ summary: 'Get Users' })
    @ApiResponse({
        status: 200,
        description: 'Users retrieved successfully',
        schema: {
            example: ApiResponseExample.success(200, 'request successful'),
        },
        type: ApiResponseDto,
    })
    @ApiQuery({ name: 'role', enum: ['user', 'admin'], required: false })
    @Get()
    async findAll(@Query('role') role?: 'user' | 'admin'): Promise<User[]> {
        return this.usersService.findAll(role);
    }

    @ApiOperation({ summary: 'Get User' })
    @ApiResponse({
        status: 200,
        description: 'User retrieved successfully',
        schema: {
            example: ApiResponseExample.success(200, 'request successful'),
        },
        type: ApiResponseDto,
    })
    @Get(':id')
    async findOne(@Param('id') id: string): Promise<User> {
        return this.usersService.findOne(id);
    }

    @ApiOperation({ summary: 'Update User' })
    @ApiResponse({
        status: 200,
        description: 'User updated successfully',
        schema: {
            example: ApiResponseExample.success(200, 'request successful'),
        },
        type: ApiResponseDto,
    })
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
