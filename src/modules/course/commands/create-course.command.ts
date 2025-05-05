export class CreateCourseCommand {
  constructor(
    public readonly title: string,
    public readonly description: string,
    public readonly authorId: string,
  ) {}
}
