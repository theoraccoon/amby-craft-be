import { IQueryHandler, QueryHandler } from '@nestjs/cqrs';
import { refreshTokenQuery } from '../refresh-token';
import { AuthService } from '../../services/auth.service';

@QueryHandler(refreshTokenQuery)
export class RefreshTokenHandler implements IQueryHandler<refreshTokenQuery> {
  constructor(private readonly authService: AuthService) {}

  async execute(query: refreshTokenQuery) {
    return await this.authService.validateRefreshToken(query.req, query.res);
  }
}
