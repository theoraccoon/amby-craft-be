export class UpdateLessonCommand {
  constructor(
    public readonly lessonId: string,
    public readonly data: {
      title?: string;
    },
    public readonly userId: string
  ) {}
}
