export class DeleteLessonCommand {
  constructor(
    public readonly lessonId: string,
    public readonly userId: string,
  ) {}
}
