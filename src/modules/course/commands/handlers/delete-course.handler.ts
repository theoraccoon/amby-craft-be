import { CommandHandler, ICommandHandler } from '@nestjs/cqrs';
import { DeleteCourseCommand } from '../delete-course.command';
import { DatabaseService } from '@common/database/database.service';
import { NotFoundException, ForbiddenException } from '@nestjs/common';

@CommandHandler(DeleteCourseCommand)
export class DeleteCourseHandler implements ICommandHandler<DeleteCourseCommand> {
  constructor(private readonly db: DatabaseService) {}

  async execute(command: DeleteCourseCommand): Promise<string> {
    const { courseId, userId } = command;

    // Check if course exisets
    const course = await this.db.course.findUnique({
      where: { id: courseId },
      include: {
        author: true,
      },
    });

    if (!course) {
      throw new NotFoundException('Course not found');
    }

    // Check if user is the author of the course
    if (course.authorId !== userId) {
      throw new ForbiddenException('You are not allowed to delete this course');
    }

    // Delete all blocks associated with the course
    await this.db.block.deleteMany({
      where: { lesson: { courseId } },
    });

    // Delete all lessons associated with the course
    await this.db.lesson.deleteMany({
      where: { courseId },
    });

    // Delete the course
    await this.db.course.delete({
      where: { id: courseId },
    });

    return 'Course deleted successfully';
  }
}
