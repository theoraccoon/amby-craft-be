import { CommandHandler, ICommandHandler } from '@nestjs/cqrs';
import { ForbiddenException, NotFoundException } from '@nestjs/common';
import { UpdateLessonCommand } from '../update-lesson.command';
import { DatabaseService } from '@common/database/database.service';
import { Lesson } from '@prisma/client';

@CommandHandler(UpdateLessonCommand)
export class UpdateLessonHandler implements ICommandHandler<UpdateLessonCommand> {
  constructor(private readonly db: DatabaseService) {}

  async execute(command: UpdateLessonCommand): Promise<Lesson> {
    const { lessonId, data, userId } = command;

    const lesson = await this.db.lesson.findUnique({
      where: { id: lessonId },
      include: {
        course: {
          select: {
            authorId: true,
          },
        },
      },
    });

    if (!lesson) {
      throw new NotFoundException('Lesson not found');
    }

    if (lesson.course.authorId !== userId) {
      throw new ForbiddenException('You are not allowed to update this lesson');
    }

    const updatedLesson = await this.db.lesson.update({
      where: { id: lessonId },
      data,
    });

    return updatedLesson;
  }
}
