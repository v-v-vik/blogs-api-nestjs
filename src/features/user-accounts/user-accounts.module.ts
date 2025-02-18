import { Module } from '@nestjs/common';
import { UsersController } from './api/users.controller';
import { UsersService } from './application/users.service';
import { MongooseModule } from '@nestjs/mongoose';
import { BcryptService } from './application/bcrypt.service';
import { NotificationsModule } from '../notifications/notifications.module';
import { AuthController } from './api/auth.controller';
import { AuthService } from './application/auth.service';
import { JwtModule, JwtService } from '@nestjs/jwt';
import { JwtStrategy } from './guards/bearer/jwt.strategy';
import { LocalStrategy } from './guards/local/local.strategy';
import { UserAccountsConfig } from './config/user-accounts.config';
import {
  ACCESS_TOKEN_STRATEGY_INJECT_TOKEN,
  REFRESH_TOKEN_STRATEGY_INJECT_TOKEN,
} from './constants/auth-tokens.inject-constants';
import { LoginUserUseCase } from './application/useCases/login-user.usercase';
import { RtJwtStrategy } from './guards/refresh-token/rt-jwt.strategy';
import { RefreshTokenUseCase } from './application/useCases/refresh-token.usecase';
import { SessionsController } from './sessions/api/sessions.controller';
import { TerminateAllSessionsUseCase } from './sessions/application/useCases/terminate-all-sessions.usecase';
import { TerminateSessionUseCase } from './sessions/application/useCases/terminate-session-by-id.usecase';
import { LogoutUserUseCase } from './application/useCases/logout-user.usecase';
import { SQLUsersRepository } from './infrastructure/user-sql.repository';
import { SQLUsersQueryRepository } from './infrastructure/user-sql.query-repository';
import { CreateUserAdminUseCase } from './application/useCases/admin/create-user-admin.usecase';
import { RegisterUserUseCase } from './application/useCases/register-user.usecase';
import { SQLSessionsRepository } from './sessions/infrastructure/session-sql.repository';
import { SQLSessionsQueryRepository } from './sessions/infrastructure/session-sql.query-repository';

const useCases = [
  LoginUserUseCase,
  RefreshTokenUseCase,
  TerminateAllSessionsUseCase,
  TerminateSessionUseCase,
  LogoutUserUseCase,
  CreateUserAdminUseCase,
  RegisterUserUseCase,
];

@Module({
  imports: [
    MongooseModule.forFeature([
      //{ name: User.name, schema: UserSchema },
      //{ name: Session.name, schema: sessionSchema },
    ]),
    //TypeOrmModule.forFeature([]),
    NotificationsModule,
    JwtModule,
  ],
  controllers: [UsersController, AuthController, SessionsController],
  providers: [
    UsersService,
    //UsersRepository,
    //UsersQueryRepository,
    BcryptService,
    AuthService,
    LocalStrategy,
    JwtStrategy,
    RtJwtStrategy,
    SQLUsersQueryRepository,
    SQLUsersRepository,
    {
      provide: ACCESS_TOKEN_STRATEGY_INJECT_TOKEN,
      useFactory: (userAccountConfig: UserAccountsConfig): JwtService => {
        return new JwtService({
          secret: userAccountConfig.accessTokenSecret,
          signOptions: { expiresIn: userAccountConfig.accessTokenExpiresIn },
        });
      },
      inject: [UserAccountsConfig],
    },
    {
      provide: REFRESH_TOKEN_STRATEGY_INJECT_TOKEN,
      useFactory: (userAccountConfig: UserAccountsConfig): JwtService => {
        return new JwtService({
          secret: userAccountConfig.refreshTokenSecret,
          signOptions: { expiresIn: userAccountConfig.refreshTokenExpiresIn },
        });
      },
      inject: [UserAccountsConfig],
    },
    UserAccountsConfig,
    //SessionsRepository,
    ...useCases,
    //SessionsQueryRepository,
    SQLSessionsRepository,
    SQLSessionsQueryRepository,
  ],
  exports: [MongooseModule, JwtStrategy, SQLUsersRepository],
})
export class UserAccountsModule {}
