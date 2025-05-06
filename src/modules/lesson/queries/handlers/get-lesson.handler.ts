import { IQueryHandler, QueryHandler } from '@nestjs/cqrs';
import { GetLessonQuery } from '../get-lesson.query';
import { DatabaseService } from '@database/database.service';
import { Lesson } from '@prisma/client';

@QueryHandler(GetLessonQuery)
export class GetLessonHandler implements IQueryHandler<GetLessonQuery> {
  constructor(private readonly databaseService: DatabaseService) {}

  async execute(query: GetLessonQuery): Promise<Lesson | null> {
    return this.databaseService.lesson.findUnique({
      where: { id: query.lessonId },
      include: { blocks: true },
    });
  }
}
