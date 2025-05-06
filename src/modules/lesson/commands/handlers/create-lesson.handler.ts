import { CommandHandler, ICommandHandler } from '@nestjs/cqrs';
import { Lesson } from '@prisma/client';
import { CreateLessonCommand } from '../create-lesson.command';
import { DatabaseService } from '@database/database.service';

@CommandHandler(CreateLessonCommand)
export class CreateLessonHandler implements ICommandHandler<CreateLessonCommand> {
  constructor(private readonly databaseService: DatabaseService) {}

  async execute(command: CreateLessonCommand): Promise<Lesson> {
    const { createLessonRequest } = command;
    return this.databaseService.lesson.create({
      data: {
        ...createLessonRequest,
      },
    });
  }
}
