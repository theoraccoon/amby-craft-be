import { CommandHandler, ICommandHandler } from '@nestjs/cqrs';
import { Block } from '@prisma/client';
import { CreateBlockCommand } from '../create-block.command';
import { DatabaseService } from '@common/database/database.service';
import { ForbiddenException, NotFoundException } from '@nestjs/common';

@CommandHandler(CreateBlockCommand)
export class CreateBlockHandler implements ICommandHandler<CreateBlockCommand> {
  constructor(private readonly databaseService: DatabaseService) {}

  async execute(command: CreateBlockCommand): Promise<Block> {
    const { type, content, order, lessonId } = command.createBlockRequest;
    const userId = command.userId;

    const lesson = await this.databaseService.lesson.findUnique({
      where: { id: lessonId },
      select: {
        course: {
          select: {
            authorId: true,
          },
        },
      },
    });

    // Ensure the lesson is valid
    if (!lesson) {
      throw new NotFoundException('Lesson not found');
    }

    // Ensure the user is the owner of the lesson and course
    if (lesson.course.authorId !== userId) {
      throw new ForbiddenException('You are not allowed to create contents for this course');
    }

    // Increase the order of other lessons after this lesson
    await this.databaseService.block.updateMany({
      where: {
        lessonId,
        order: { gte: order },
      },
      data: {
        order: {
          increment: 1,
        },
      },
    });

    return this.databaseService.block.create({
      data: {
        type,
        content,
        order,
        lessonId,
      },
    });
  }
}
