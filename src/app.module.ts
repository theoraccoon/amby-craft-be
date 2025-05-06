import { Module } from '@nestjs/common';
import { AppService } from './app.service';
import { AppController } from './app.controller';
import { GoogleAuthModule } from '@google/google-auth.module';
import { UsersModule } from './users/users.module';
import { AuthModule } from './auth/auth.module';
import { ConfigModule } from '@nestjs/config';
import { CoursesModule } from './modules/course/course.module';
import { DatabaseModule } from '@database/database.module';

@Module({
  imports: [ConfigModule.forRoot({ isGlobal: true }), DatabaseModule, GoogleAuthModule, UsersModule, AuthModule, CoursesModule],
  controllers: [AppController],
  providers: [AppService],
})
export class AppModule {}
