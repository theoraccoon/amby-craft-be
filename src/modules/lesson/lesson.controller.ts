import { Body, Controller, Delete, Get, Param, Patch, Post, UseGuards } from '@nestjs/common';
import { CommandBus, QueryBus } from '@nestjs/cqrs';
import { CreateLessonCommand } from './commands/create-lesson.command';
import { CreateLessonDto } from './dto/create-lesson.dto';
import { GetLessonQuery } from './queries/get-lesson.query';
import { GetAllLessonsQuery } from './queries/get-all-lessons.query';
import { AuthGuard } from '@nestjs/passport';
import { UpdateLessonCommand } from './commands/update-lesson.command';
import { UpdateLessonDto } from './dto/update-lesson.dto';
import { CurrentUser } from '@common/decorators/current-user.decorator';
import { Lesson } from '@prisma/client';
import { DeleteLessonCommand } from './commands/delete-lesson.command';

@UseGuards(AuthGuard('jwt'))
@Controller('lessons')
export class LessonsController {
  constructor(
    private readonly commandBus: CommandBus,
    private readonly queryBus: QueryBus,
  ) {}

  @Get()
  async getAllLessons() {
    return this.queryBus.execute(new GetAllLessonsQuery());
  }

  @Post()
  async createLesson(@Body() createLessonDto: CreateLessonDto, @CurrentUser('userId') userId: string) {
    if (!userId) {
      throw new Error('Author ID is missing from token');
    }
    return this.commandBus.execute(new CreateLessonCommand(createLessonDto, userId));
  }

  @Get(':id')
  async getLesson(@Param('id') id: string, @CurrentUser('userId') userId: string) {
    if (!userId) {
      throw new Error('Author ID is missing from token');
    }
    return this.queryBus.execute(new GetLessonQuery(id, userId));
  }

  @Patch(':id')
  async updateLesson(@Param('id') lessonId: string, @Body() dto: UpdateLessonDto, @CurrentUser('userId') userId: string): Promise<Lesson> {
    return await this.commandBus.execute(new UpdateLessonCommand(lessonId, dto, userId));
  }

  @Delete(':id')
  async deleteLesson(@Param('id') lessonId: string, @CurrentUser('userId') userId: string) {
    return this.commandBus.execute(new DeleteLessonCommand(lessonId, userId));
  }
}
