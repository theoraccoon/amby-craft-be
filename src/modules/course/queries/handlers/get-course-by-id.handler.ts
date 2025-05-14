import { IQueryHandler, QueryHandler } from '@nestjs/cqrs';
import { Course } from '@prisma/client';
import { GetCourseQuery } from '../get-course-by-id.query';
import { DatabaseService } from '@common/database/database.service';
import { ForbiddenException, NotFoundException } from '@nestjs/common';

@QueryHandler(GetCourseQuery)
export class GetCourseHandler implements IQueryHandler<GetCourseQuery> {
  constructor(private readonly databaseService: DatabaseService) {}

  async execute(query: GetCourseQuery): Promise<Course | null> {
    const course = await this.databaseService.course.findUnique({
      where: { id: query.courseId },
      include: {
        lessons: true,
      },
    });

    if (!course) {
      throw new NotFoundException('Course not found');
    }

    if (course.authorId !== query.authorId) {
      throw new ForbiddenException('You do not have permission to access this course');
    }

    return course;
  }
}
