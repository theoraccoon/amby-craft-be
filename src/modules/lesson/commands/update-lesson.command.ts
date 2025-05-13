export class UpdateLessonCommand {
  constructor(
    public readonly lessonId: string,
    public readonly data: {
      title?: string;
      order?: number;
    },
    public readonly userId: string
  ) {}
}
