import { IQueryHandler, QueryHandler } from '@nestjs/cqrs';
import { LoginQuery } from '../queries/login.query';
import { AuthService } from 'src/auth/local/local.service';

@QueryHandler(LoginQuery)
export class LoginHandler implements IQueryHandler<LoginQuery> {
  constructor(private readonly authService: AuthService) {}

  async execute(query: LoginQuery) {
    return await this.authService.login(query.body, query.response);
  }
}
