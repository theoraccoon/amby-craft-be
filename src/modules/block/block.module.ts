import { Module } from '@nestjs/common';
import { CqrsModule } from '@nestjs/cqrs';
import { BlocksController } from './block.controller';
import { CreateBlockHandler } from './commands/handlers/create-block.handler';
import { DeleteBlockHandler } from './commands/handlers/delete-block.handler';
import { GetBlockHandler } from './queries/handlers/get-block-by-id.handler';
import { GetAllBlocksHandler } from './queries/handlers/get-all-blocks.handler';

@Module({
  imports: [CqrsModule],
  controllers: [BlocksController],
  providers: [CreateBlockHandler, DeleteBlockHandler, GetBlockHandler, GetAllBlocksHandler],
})
export class BlockModule {}
