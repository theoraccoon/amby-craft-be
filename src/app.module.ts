import { Module } from '@nestjs/common';
import { AppService } from './app.service';
import { AppController } from './app.controller';
import { GoogleAuthModule } from 'src/modules/auth/google/google-auth.module';
import { UsersModule } from './users/users.module';
import { ConfigModule } from '@nestjs/config';
import { CourseModule } from './modules/course/courses.module';
import { DatabaseModule } from '@database/database.module';
import { AuthModule } from './modules/auth/basic/auth.module';
import { LessonModule } from '@modules/lesson/lesson.module';
import * as path from 'path';

console.log('i18n path at runtime:', path.join(__dirname, './config/lang/'));
@Module({
  imports: [ConfigModule.forRoot({ isGlobal: true }), DatabaseModule, GoogleAuthModule, UsersModule, AuthModule, CourseModule, LessonModule],
  controllers: [AppController],
  providers: [AppService],
})
export class AppModule {}
