import { Module } from '@nestjs/common';
import { AppService } from './app.service';
import { AppController } from './app.controller';
import { GoogleAuthModule } from 'src/modules/auth/google/google-auth.module';
import { UsersModule } from './modules/users/users.module';
import { ConfigModule } from '@nestjs/config';
import { CourseModule } from './modules/course/courses.module';
import { DatabaseModule } from '@common/database/database.module';
import { AuthModule } from './modules/auth/basic/auth.module';
import { LessonModule } from '@modules/lesson/lesson.module';
import { BlockModule } from '@modules/block/block.module';
import { NotificationsModule } from './modules/notifications/notifications.module';

@Module({
  imports: [ConfigModule.forRoot({ isGlobal: true }), DatabaseModule, GoogleAuthModule, UsersModule, AuthModule, CourseModule, LessonModule, BlockModule, NotificationsModule],
  controllers: [AppController],
  providers: [AppService],
})
export class AppModule {}
