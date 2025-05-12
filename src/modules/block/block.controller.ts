import { Controller, Post, Body, Get, Param } from '@nestjs/common';
import { CommandBus, QueryBus } from '@nestjs/cqrs';
import { CreateBlockCommand } from './commands/create-block.command';
import { CreateBlockDto } from './dto/create-block.dto';
import { GetBlockQuery } from './queries/get-block-by-id.query';

@Controller('blocks')
export class BlocksController {
  constructor(
    private readonly commandBus: CommandBus,
    private readonly queryBus: QueryBus,
  ) {}

  @Post()
  async createBlock(@Body() createBlockDto: CreateBlockDto) {
    return this.commandBus.execute(new CreateBlockCommand(createBlockDto));
  }

  @Get(':id')
  async getBlock(@Param('id') id: string) {
    return this.queryBus.execute(new GetBlockQuery(id));
  }
}
