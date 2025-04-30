import { Module } from '@nestjs/common';
import { AppService } from './app.service';
import { AppController } from './app.controller';
import { GoogleAuthModule } from '@google/google-auth.module';
import { UsersModule } from './users/users.module';

@Module({
    imports: [GoogleAuthModule, UsersModule],
    controllers: [AppController],
    providers: [AppService],
})
export class AppModule {}
