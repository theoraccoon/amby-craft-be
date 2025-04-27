import { Module } from '@nestjs/common';
import { AuthService } from './auth.service';
import { AuthController } from './auth.controller';
import { UsersModule } from 'src/users/users.module';
import { DatabaseModule } from 'src/database/database.module';

@Module({
    imports: [UsersModule, DatabaseModule],
    providers: [AuthService],
    controllers: [AuthController],
})
export class AuthModule {}
