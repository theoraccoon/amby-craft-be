import { Module } from '@nestjs/common';
import { AppService } from './app.service';
import { AppController } from './app.controller';
import { UsersModule } from './modules/users/users.module';
import { ConfigModule } from '@nestjs/config';
import { CourseModule } from './modules/course/courses.module';
import { DatabaseModule } from '@common/database/database.module';
import { AuthModule } from './modules/auth/auth.module';
import { LessonModule } from '@modules/lesson/lesson.module';
import { BlockModule } from '@modules/block/block.module';
import { NotificationsModule } from './modules/notifications/notifications.module';
import { I18nModule, AcceptLanguageResolver, QueryResolver } from 'nestjs-i18n';
import * as path from 'path';

@Module({
  imports: [
    I18nModule.forRoot({
      fallbackLanguage: 'en',
      loaderOptions: {
        path: path.join(__dirname, 'common/config/lang'),
        watch: true,
      },
      resolvers: [{ use: QueryResolver, options: ['lang'] }, AcceptLanguageResolver],
    }),
    ConfigModule.forRoot({ isGlobal: true }),
    DatabaseModule,
    UsersModule,
    AuthModule,
    CourseModule,
    LessonModule,
    BlockModule,
    NotificationsModule,
  ],
  controllers: [AppController],
  providers: [AppService],
})
export class AppModule {}
