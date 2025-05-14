export class GetCourseQuery {
  constructor(
    public readonly courseId: string,
    public readonly authorId: string
  ) {}
}
