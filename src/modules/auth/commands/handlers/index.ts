import { GoogleAuthCommandHandler } from './google-auth-command.handler';
import { LoginUserCommandHandler } from './login-user-command.handler';
import { LogoutUserCommandHandler } from './logout-user-command.handler';
import { RefreshTokenCommandHandler } from './refresh-token-command.handler';
import { RegisterUserCommandHandler } from './register-user.handler';

export const AuthCommandHandlers = [RegisterUserCommandHandler, LoginUserCommandHandler, LogoutUserCommandHandler, RefreshTokenCommandHandler, GoogleAuthCommandHandler];
