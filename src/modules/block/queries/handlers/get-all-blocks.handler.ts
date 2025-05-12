import { QueryHandler, IQueryHandler } from '@nestjs/cqrs';
import { Block } from '@prisma/client';
import { DatabaseService } from '@common/database/database.service';
import { GetAllBlocksQuery } from '../get-all-blocks.query';

@QueryHandler(GetAllBlocksQuery)
export class GetAllBlocksHandler implements IQueryHandler<GetAllBlocksQuery> {
  constructor(private readonly databaseService: DatabaseService) {}

  async execute(): Promise<Block[] | []> {
    return this.databaseService.block.findMany();
  }
}
