import { CommandHandler, ICommandHandler } from '@nestjs/cqrs';
import { UpdateCourseCommand } from '../update-course.command';
import { DatabaseService } from '@common/database/database.service';
import { ForbiddenException, NotFoundException } from '@nestjs/common';

@CommandHandler(UpdateCourseCommand)
export class UpdateCourseHandler implements ICommandHandler<UpdateCourseCommand> {
  constructor(private readonly db: DatabaseService) {}

  async execute(command: UpdateCourseCommand) {
    const { courseId, userId, updateData } = command;

    const course = await this.db.course.findUnique({
      where: { id: courseId },
      select: {
        id: true,
        authorId: true,
      },
    });

    if (!course) {
      throw new NotFoundException('Course not found');
    }

    if (course.authorId !== userId) {
      throw new ForbiddenException('You are not allowed to update this course');
    }

    return this.db.course.update({
      where: { id: courseId },
      data: updateData,
    });
  }
}
