import { Controller, Post, Body, Get, Param, UseGuards, Patch } from '@nestjs/common';
import { CommandBus, QueryBus } from '@nestjs/cqrs';
import { CreateCourseCommand } from './commands/create-course.command';
import { GetCourseQuery } from './queries/get-course-by-id.query';
import { CreateCourseDto } from './dto/create-course.dto';
import { GetAllCoursesQuery } from './queries/get-all-courses.query';
import { AuthGuard } from '@nestjs/passport';
import { CurrentUser } from '@common/decorators/current-user.decorator';
import { UpdateCourseDto } from './dto/update-course.dto';
import { UpdateCourseCommand } from './commands/update-course.command';

@UseGuards(AuthGuard('jwt'))
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

  @Post()
  async createCourse(@Body() createCourseDto: CreateCourseDto, @CurrentUser('userId') authorId: string) {
    if (!authorId) {
      throw new Error('Author ID is missing from token');
    }

    return this.commandBus.execute(new CreateCourseCommand(createCourseDto, authorId));
  }

  @Get(':id')
  async getCourse(@Param('id') id: string) {
    return this.queryBus.execute(new GetCourseQuery(id));
  }

  @Patch(':id')
  async updateCourse(@Param('id') courseId: string, @CurrentUser('userId') userId: string, @Body() updateData: UpdateCourseDto) {
    return this.commandBus.execute(new UpdateCourseCommand(courseId, userId, updateData));
  }
}
