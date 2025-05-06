import { Module } from '@nestjs/common';
import { AppService } from './app.service';
import { AppController } from './app.controller';
import { GoogleAuthModule } from 'src/modules/auth/google/google-auth.module';
import { UsersModule } from './users/users.module';
import { AuthModule } from './auth/auth.module';
import { ConfigModule } from '@nestjs/config';
import { CourseModule } from './modules/course/courses.module';
import { DatabaseModule } from '@database/database.module';
import { LessonModule } from '@modules/lesson/lesson.module';

@Module({
  imports: [ConfigModule.forRoot({ isGlobal: true }), DatabaseModule, GoogleAuthModule, UsersModule, AuthModule, CourseModule, LessonModule],
  controllers: [AppController],
  providers: [AppService],
})
export class AppModule {}
