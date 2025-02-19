import { LoginUserUseCase } from '../application/useCases/login-user.usercase';
import { RefreshTokenUseCase } from '../application/useCases/refresh-token.usecase';
import { TerminateAllSessionsUseCase } from '../sessions/application/useCases/terminate-all-sessions.usecase';
import { TerminateSessionUseCase } from '../sessions/application/useCases/terminate-session-by-id.usecase';
import { LogoutUserUseCase } from '../application/useCases/logout-user.usecase';
import { CreateUserAdminUseCase } from '../application/useCases/admin/create-user-admin.usecase';
import { RegisterUserUseCase } from '../application/useCases/register-user.usecase';

export const useCases = [
  LoginUserUseCase,
  RefreshTokenUseCase,
  TerminateAllSessionsUseCase,
  TerminateSessionUseCase,
  LogoutUserUseCase,
  CreateUserAdminUseCase,
  RegisterUserUseCase,
];
