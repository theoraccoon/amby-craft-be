import { GoogleAuthCommandHandler } from './google-auth-command.handler';
import { LoginUserCommandHandler } from './login-user-command.handler';
import { RefreshTokenCommandHandler } from './refresh-token-command.handler';
import { RegisterUserCommandHandler } from './register-user.handler';
import { SignOutHandler } from './signout.handler';

export const AuthCommandHandlers = [RegisterUserCommandHandler, SignOutHandler, RefreshTokenCommandHandler, LoginUserCommandHandler, GoogleAuthCommandHandler];
