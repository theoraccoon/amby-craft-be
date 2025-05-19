import { Response } from 'express';

export class RefreshTokenCommand {
  constructor(
    public readonly refreshToken: string,
    public readonly userId: string,
    public readonly response: Response,
  ) {}
}
