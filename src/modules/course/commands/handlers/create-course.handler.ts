import { CommandHandler, ICommandHandler } from '@nestjs/cqrs';
import { Course } from '@prisma/client';
import { CreateCourseCommand } from '../create-course.command';
import { DatabaseService } from '@database/database.service';

@CommandHandler(CreateCourseCommand)
export class CreateCourseHandler implements ICommandHandler<CreateCourseCommand> {
  constructor(private readonly databaseService: DatabaseService) {}

  async execute({ createCourseRequest, authorId }: CreateCourseCommand): Promise<Course> {
    const { title, description } = createCourseRequest;

    return this.databaseService.course.create({
      data: {
        title,
        description,
        authorId,
      },
    });
  }
}
