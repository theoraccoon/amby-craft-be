import { QueryHandler, IQueryHandler } from '@nestjs/cqrs';
import { Block } from '@prisma/client';
import { GetBlockQuery } from '../get-block-by-id.query';
import { DatabaseService } from '@common/database/database.service';

@QueryHandler(GetBlockQuery)
export class GetBlockHandler implements IQueryHandler<GetBlockQuery> {
  constructor(private readonly databaseService: DatabaseService) {}

  async execute(query: GetBlockQuery): Promise<Block | null> {
    return this.databaseService.block.findUnique({
      where: { id: query.blockId },
    });
  }
}
