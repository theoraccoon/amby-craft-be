import { IQueryHandler, QueryHandler } from '@nestjs/cqrs';
import { refreshTokenQuery } from '../queries/refresh-token';
import { AuthService } from 'src/auth/local/local.service';

@QueryHandler(refreshTokenQuery)
export class RefreshTokenHandler implements IQueryHandler<refreshTokenQuery> {
  constructor(private readonly authService: AuthService) {}

  async execute(query: refreshTokenQuery) {
    return await this.authService.validateRefreshToken(query.req, query.res);
  }
}
