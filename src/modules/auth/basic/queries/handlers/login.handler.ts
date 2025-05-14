import { QueryHandler, IQueryHandler } from '@nestjs/cqrs';
import { AuthService } from '../../services/auth.service';
import { LoginQuery } from '../login.query';

@QueryHandler(LoginQuery)
export class LoginHandler implements IQueryHandler<LoginQuery> {
  constructor(private readonly authService: AuthService) {}

  async execute(query: LoginQuery) {
    return await this.authService.login(query.body, query.response);
  }
}
