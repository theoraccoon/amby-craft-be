import { CommandHandler, ICommandHandler } from '@nestjs/cqrs';
import { Lesson } from '@prisma/client';
import { CreateLessonCommand } from '../create-lesson.command';
import { DatabaseService } from '@common/database/database.service';
import { ForbiddenException, NotFoundException } from '@nestjs/common';

@CommandHandler(CreateLessonCommand)
export class CreateLessonHandler implements ICommandHandler<CreateLessonCommand> {
  constructor(private readonly databaseService: DatabaseService) {}

  async execute(command: CreateLessonCommand): Promise<Lesson> {
    const { createLessonRequest, userId } = command;
    const { order, courseId } = createLessonRequest;

    const course = await this.databaseService.course.findUnique({
      where: { id: courseId },
    });

    // Ensure the course is valid
    if (!course) {
      throw new NotFoundException('Course not found');
    }

    // Ensure the user is the owner of the course
    if (course.authorId !== userId) {
      throw new ForbiddenException('You are not allowed to create lessons for this course');
    }

    // Increase the order of other lessons after this lesson
    await this.databaseService.lesson.updateMany({
      where: {
        courseId,
        order: { gte: order },
      },
      data: {
        order: {
          increment: 1,
        },
      },
    });

    return this.databaseService.lesson.create({
      data: {
        ...createLessonRequest,
      },
    });
  }
}
