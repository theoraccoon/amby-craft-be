import { Controller, Post, Body, Req, Get, Param } from '@nestjs/common';
import { Request } from 'express';
import { CommandBus, QueryBus } from '@nestjs/cqrs';
import { CreateCourseCommand } from './commands/create-course.command';
import { CreateCourseDto } from './dto/create-course.dto';
import { GetCourseQuery } from './queries/get-course-by-id.query';

@Controller('courses')
export class CoursesController {
  constructor(
    private readonly commandBus: CommandBus,
    private readonly queryBus: QueryBus,
  ) {}

  @Post()
  async createCourse(@Body() createCourseDto: CreateCourseDto, @Req() req: Request & { user?: { id: string } }) {
    const authorId = req.user?.id || '';
    if (!authorId) {
      throw new Error('Author ID is missing');
    }
    return this.commandBus.execute(new CreateCourseCommand(createCourseDto.title, createCourseDto.description || '', authorId));
  }

  @Get(':id')
  async getCourse(@Param('id') id: string) {
    return this.queryBus.execute(new GetCourseQuery(id));
  }
}
