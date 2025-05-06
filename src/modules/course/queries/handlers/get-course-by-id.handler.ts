import { IQueryHandler, QueryHandler } from '@nestjs/cqrs';
import { Course } from '@prisma/client';
import { GetCourseQuery } from '../get-course-by-id.query';
import { DatabaseService } from '@database/database.service';

@QueryHandler(GetCourseQuery)
export class GetCourseHandler implements IQueryHandler<GetCourseQuery> {
  constructor(private readonly databaseService: DatabaseService) {}

  async execute(query: GetCourseQuery): Promise<Course | null> {
    return this.databaseService.course.findUnique({
      where: { id: query.courseId },
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
