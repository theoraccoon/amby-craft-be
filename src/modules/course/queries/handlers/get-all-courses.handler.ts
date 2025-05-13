import { IQueryHandler, QueryHandler } from '@nestjs/cqrs';
import { Course } from '@prisma/client';
import { DatabaseService } from '@common/database/database.service';
import { GetAllCoursesQuery } from '../get-all-courses.query';

@QueryHandler(GetAllCoursesQuery)
export class GetAllCoursesHandler implements IQueryHandler<GetAllCoursesQuery> {
  constructor(private readonly databaseService: DatabaseService) {}

  async execute(): Promise<Course[] | []> {
    return this.databaseService.course.findMany({
      include: {
        lessons: {
          include: {
            blocks: true,
          },
        },
      },
    });
  }
}
