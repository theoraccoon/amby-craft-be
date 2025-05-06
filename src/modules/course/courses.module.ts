import { Module } from '@nestjs/common';
import { CqrsModule } from '@nestjs/cqrs';
import { CreateCourseHandler } from './commands/handlers/create-course.handler';
import { CoursesController } from './courses.controller';
import { GetCourseHandler } from './queries/handlers/get-course-by-id.handler';

@Module({
  imports: [CqrsModule],
  controllers: [CoursesController],
  providers: [CreateCourseHandler, GetCourseHandler],
})
export class CourseModule {}
