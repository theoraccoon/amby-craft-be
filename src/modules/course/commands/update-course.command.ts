export class UpdateCourseCommand {
  constructor(
    public readonly courseId: string,
    public readonly userId: string,
    public readonly updateData: {
      title?: string;
      description?: string;
    },
  ) {}
}
