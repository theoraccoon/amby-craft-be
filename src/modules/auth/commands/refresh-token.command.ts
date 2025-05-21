import { RefreshTokenDto } from '../dto/refresh-token.dto';

export class RefreshTokenCommand {
  constructor(public readonly refreshTokenRequest: RefreshTokenDto) {}
}
