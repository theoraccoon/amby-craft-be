import { Response } from 'express';

export class SignOutCommand {
  constructor(
    public readonly res: Response,
    public readonly userId: string
  ) {}
}
