import { Controller, Post, Body, Get, Param, Delete, Patch, UseGuards } from '@nestjs/common';
import { CommandBus, QueryBus } from '@nestjs/cqrs';
import { CreateBlockCommand } from './commands/create-block.command';
import { CreateBlockDto } from './dto/create-block.dto';
import { GetBlockQuery } from './queries/get-block-by-id.query';
import { GetAllBlocksQuery } from './queries/get-all-blocks.query';
import { DeleteBlockCommand } from './commands/delete-block.command';
import { AuthGuard } from '@nestjs/passport';
import { UpdateBlockDto } from './dto/update-block.dto';
import { CurrentUser } from '@common/decorators/current-user.decorator';
import { UpdateBlockCommand } from './commands/update-block.command';

@UseGuards(AuthGuard('jwt'))
@Controller('blocks')
export class BlocksController {
  constructor(
    private readonly commandBus: CommandBus,
    private readonly queryBus: QueryBus,
  ) {}

  @Get()
  async getAllBlocks() {
    return this.queryBus.execute(new GetAllBlocksQuery());
  }

  @Post()
  async createBlock(@Body() createBlockDto: CreateBlockDto, @CurrentUser('userId') userId: string) {
    if (!userId) {
      throw new Error('Author ID is missing from token');
    }
    return this.commandBus.execute(new CreateBlockCommand(createBlockDto, userId));
  }

  @Get(':id')
  async getBlock(@Param('id') id: string) {
    return this.queryBus.execute(new GetBlockQuery(id));
  }

  @Patch(':id')
  async updateBlock(@Param('id') blockId: string, @Body() dto: UpdateBlockDto, @CurrentUser('userId') userId: string): Promise<any> {
    return await this.commandBus.execute(new UpdateBlockCommand(blockId, dto, userId));
  }

  @Delete(':id')
  async deleteBlock(@Param('id') id: string) {
    return this.commandBus.execute(new DeleteBlockCommand(id));
  }
}
