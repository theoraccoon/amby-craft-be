import { CommandHandler, ICommandHandler } from '@nestjs/cqrs';
import { ForbiddenException, NotFoundException } from '@nestjs/common';
import { DeleteLessonCommand } from '../delete-lesson.command';
import { DatabaseService } from '@common/database/database.service';

@CommandHandler(DeleteLessonCommand)
export class DeleteLessonHandler implements ICommandHandler<DeleteLessonCommand> {
  constructor(private readonly db: DatabaseService) {}

  async execute(command: DeleteLessonCommand): Promise<string> {
    const { lessonId, userId } = command;

    // First, check if the lesson exists and if the user has permission to delete it
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
      throw new ForbiddenException('You are not allowed to delete this lesson');
    }

    // Delete all blocks associated with this lesson first
    await this.db.block.deleteMany({
      where: { lessonId },
    });

    // Then delete the lesson
    await this.db.lesson.delete({
      where: { id: lessonId },
    });

    return 'Lesson successfully deleted';
  }
}
