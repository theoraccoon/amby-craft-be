import { CommandHandler, ICommandHandler } from '@nestjs/cqrs';
import { Block } from '@prisma/client';
import { DeleteBlockCommand } from '../delete-block.command';
import { DatabaseService } from '@common/database/database.service';

@CommandHandler(DeleteBlockCommand)
export class DeleteBlockHandler implements ICommandHandler<DeleteBlockCommand> {
  constructor(private readonly databaseService: DatabaseService) {}

  async execute(command: DeleteBlockCommand): Promise<Block> {
    return this.databaseService.block.delete({
      where: { id: command.blockId },
    });
  }
}
