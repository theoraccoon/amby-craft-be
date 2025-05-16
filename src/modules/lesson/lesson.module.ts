import { Module } from '@nestjs/common';
import { CqrsModule } from '@nestjs/cqrs';
import { LessonsController } from './lesson.controller';
import { CreateLessonHandler } from './commands/handlers/create-lesson.handler';
import { GetLessonHandler } from './queries/handlers/get-lesson.handler';
import { UpdateLessonHandler } from './commands/handlers/update-lesson.handler';
import { GetAllLessonsHandler } from './queries/handlers/get-all-lessons.handler';
import { DeleteLessonHandler } from './commands/handlers/delete-lesson.handler';

@Module({
  imports: [CqrsModule],
  controllers: [LessonsController],
  providers: [CreateLessonHandler, GetLessonHandler, GetAllLessonsHandler, UpdateLessonHandler, DeleteLessonHandler],
})
export class LessonModule {}
