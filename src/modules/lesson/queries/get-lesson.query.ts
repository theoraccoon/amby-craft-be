export class GetLessonQuery {
  constructor(
    public readonly lessonId: string,
    public readonly userId: string,
  ) {}
}
