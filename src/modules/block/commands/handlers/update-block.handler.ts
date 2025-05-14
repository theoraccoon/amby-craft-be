import { ForbiddenException, Injectable, NotFoundException } from '@nestjs/common';
import { UpdateBlockCommand } from '../update-block.command';
import { CommandHandler, ICommandHandler } from '@nestjs/cqrs';
import { DatabaseService } from '@common/database/database.service';

@CommandHandler(UpdateBlockCommand)
@Injectable()
export class UpdateBlockHandler implements ICommandHandler<UpdateBlockCommand> {
  constructor(private readonly databaseService: DatabaseService) {}

  async execute(command: UpdateBlockCommand) {
    const { blockId, dto, userId } = command;

    const block = await this.databaseService.block.findUnique({
      where: { id: blockId },
      include: {
        lesson: {
          include: {
            course: true,
          },
        },
      },
    });

    if (!block) {
      throw new NotFoundException(`Block with ID ${blockId} not found.`);
    }

    if (block.lesson.course.authorId !== userId) {
      throw new ForbiddenException('You are not authorized to update this block.');
    }

    return this.databaseService.block.update({
      where: { id: blockId },
      data: {
        ...dto,
      },
    });
  }
}
