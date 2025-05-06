import { Body, Controller, Get, Param, Post } from '@nestjs/common';
import { CommandBus, QueryBus } from '@nestjs/cqrs';
import { CreateLessonCommand } from './commands/create-lesson.command';
import { CreateLessonDto } from './dto/create-lesson.dto';
import { GetLessonQuery } from './queries/get-lesson.query';

@Controller('lessons')
export class LessonsController {
  constructor(
    private readonly commandBus: CommandBus,
    private readonly queryBus: QueryBus,
  ) {}

  @Post()
  async createLesson(@Body() createLessonDto: CreateLessonDto) {
    return this.commandBus.execute(new CreateLessonCommand(createLessonDto));
  }

  @Get(':id')
  async getLesson(@Param('id') id: string) {
    return this.queryBus.execute(new GetLessonQuery(id));
  }
}
