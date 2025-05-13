import { Request, Response } from 'express';

export class refreshTokenQuery {
  constructor(
    public readonly req: Request,
    public readonly res: Response,
  ) {}
}
