export class HandleGoogleLoginCommand {
  constructor(
    public readonly googleId: string,
    public readonly email: string,
    public readonly firstName: string,
    public readonly lastName: string,
    public readonly profilePicture: string,
  ) {}
}
