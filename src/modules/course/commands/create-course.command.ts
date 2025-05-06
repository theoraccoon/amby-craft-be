import { CreateCourseDto } from '../dto/create-course.dto';

export class CreateCourseCommand {
  constructor(
    public readonly createCourseRequest: CreateCourseDto,
    public readonly authorId: string,
  ) {}
}
