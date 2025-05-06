import { IQueryHandler, QueryHandler } from '@nestjs/cqrs';
import { DatabaseService } from '@database/database.service';
import { Lesson } from '@prisma/client';
import { GetAllLessonsQuery } from '../get-all-lessons.query';

@QueryHandler(GetAllLessonsQuery)
export class GetAllLessonsHandler implements IQueryHandler<GetAllLessonsQuery> {
  constructor(private readonly databaseService: DatabaseService) {}

  async execute(): Promise<Lesson[] | []> {
    try {
      return await this.databaseService.lesson.findMany({
        include: { blocks: true },
      });
    } catch (error) {
      console.error('Error fetching lessons:', error);
      return [];
    }
  }
}
