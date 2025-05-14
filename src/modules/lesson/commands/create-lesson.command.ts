import { CreateLessonDto } from '../dto/create-lesson.dto';

export class CreateLessonCommand {
  constructor(
    public readonly createLessonRequest: CreateLessonDto,
    public readonly userId: string,
  ) {}
}
