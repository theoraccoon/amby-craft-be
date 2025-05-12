import { CommandHandler, ICommandHandler } from '@nestjs/cqrs';
import { Block } from '@prisma/client';
import { CreateBlockCommand } from '../create-block.command';
import { DatabaseService } from '@common/database/database.service';

@CommandHandler(CreateBlockCommand)
export class CreateBlockHandler implements ICommandHandler<CreateBlockCommand> {
  constructor(private readonly databaseService: DatabaseService) {}

  async execute(command: CreateBlockCommand): Promise<Block> {
    const { type, content, order, lessonId } = command.createBlockRequest;

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
