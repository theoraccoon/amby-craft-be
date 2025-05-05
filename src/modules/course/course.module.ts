import { Module } from '@nestjs/common';
import { CqrsModule } from '@nestjs/cqrs';
import { CreateCourseHandler } from './commands/handlers/create-course.handler';
import { CoursesController } from './course.controller';
import { GetCourseHandler } from './queries/handlers/get-course-by-id.handler';
import { DatabaseService } from '@database/database.service';

@Module({
  imports: [CqrsModule],
  controllers: [CoursesController],
  providers: [DatabaseService, CreateCourseHandler, GetCourseHandler],
})
export class CoursesModule {}
