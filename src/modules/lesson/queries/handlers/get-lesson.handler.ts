import { IQueryHandler, QueryHandler } from '@nestjs/cqrs';
import { GetLessonQuery } from '../get-lesson.query';
import { DatabaseService } from '@common/database/database.service';
import { Lesson } from '@prisma/client';
import { ForbiddenException, NotFoundException } from '@nestjs/common';

@QueryHandler(GetLessonQuery)
export class GetLessonHandler implements IQueryHandler<GetLessonQuery> {
  constructor(private readonly databaseService: DatabaseService) {}

  async execute(query: GetLessonQuery): Promise<Lesson | null> {
    const lesson = await this.databaseService.lesson.findUnique({
      where: { id: query.lessonId },
      include: {
        blocks: true,
        course: true,
      },
    });

    if (!lesson) {
      throw new NotFoundException('Lesson not found');
    }

    if (lesson.course.authorId !== query.userId) {
      throw new ForbiddenException('You do not have permission to access this lesson');
    }

    const { course: _course, ...lessonWithoutCourse } = lesson;

    return lessonWithoutCourse;
  }
}
