export class DeleteCourseCommand {
  constructor(
    public readonly courseId: string,
    public readonly userId: string,
  ) {}
}
