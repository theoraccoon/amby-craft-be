import { Module } from '@nestjs/common';
import { CqrsModule } from '@nestjs/cqrs';
import { CreateCourseHandler } from './commands/handlers/create-course.handler';
import { CoursesController } from './courses.controller';
import { GetCourseHandler } from './queries/handlers/get-course-by-id.handler';
import { GetAllCoursesHandler } from './queries/handlers/get-all-courses.handler';
import { UpdateCourseHandler } from './commands/handlers/update-course.handler';
import { DeleteCourseHandler } from './commands/handlers/delete-course.handler';

@Module({
  imports: [CqrsModule],
  controllers: [CoursesController],
  providers: [CreateCourseHandler, GetCourseHandler, GetAllCoursesHandler, UpdateCourseHandler, DeleteCourseHandler],
})
export class CourseModule {}
