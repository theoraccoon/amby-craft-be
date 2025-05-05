import { CommandHandler, ICommandHandler } from '@nestjs/cqrs';
import { Course } from '@prisma/client';
import { CreateCourseCommand } from '../create-course.command';
import { DatabaseService } from '@database/database.service';

@CommandHandler(CreateCourseCommand)
export class CreateCourseHandler implements ICommandHandler<CreateCourseCommand> {
  constructor(private readonly databaseService: DatabaseService) {}

  async execute(command: CreateCourseCommand): Promise<Course> {
    const { title, description, authorId } = command;
    return this.databaseService.course.create({
      data: {
        title,
        description,
        authorId,
      },
    });
  }
}
