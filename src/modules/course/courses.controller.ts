import { Controller, Post, Body, Get, Param } from '@nestjs/common';
import { CommandBus, QueryBus } from '@nestjs/cqrs';
import { CreateCourseCommand } from './commands/create-course.command';
import { GetCourseQuery } from './queries/get-course-by-id.query';
import { CreateCourseDto } from './dto/create-course.dto';
import { GetAllCoursesQuery } from './queries/get-all-courses.query';

@Controller('courses')
export class CoursesController {
  constructor(
    private readonly commandBus: CommandBus,
    private readonly queryBus: QueryBus,
  ) {}

  @Get()
  async getAllCourses() {
    return this.queryBus.execute(new GetAllCoursesQuery());
  }

  @Post(':author_id')
  async createCourse(@Body() createCourseDto: CreateCourseDto, @Param('author_id') authorId: string) {
    if (!authorId) {
      throw new Error('Author ID is missing');
    }
    return this.commandBus.execute(new CreateCourseCommand(createCourseDto, authorId));
  }

  @Get(':id')
  async getCourse(@Param('id') id: string) {
    return this.queryBus.execute(new GetCourseQuery(id));
  }
}
