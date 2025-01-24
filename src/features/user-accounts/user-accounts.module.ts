import { Module } from '@nestjs/common';
import { UsersController } from './api/users.controller';
import { UsersService } from './application/users.service';
import { MongooseModule } from '@nestjs/mongoose';
import { User, UserSchema } from './domain/user.entity';
import { UsersRepository } from './infrastructure/user.repository';
import { UsersQueryRepository } from './infrastructure/user.query-repository';
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
import { Session, sessionSchema } from './sessions/domain/session.entity';
import { SessionsRepository } from './sessions/infrastructure/session.repository';
import { LoginUserUseCase } from './application/useCases/login-user.usercase';
import { RtJwtStrategy } from './guards/refresh-token/rt-jwt.strategy';
import { RefreshTokenUseCase } from './application/useCases/refresh-token.usecase';
import { SessionsController } from './sessions/api/sessions.controller';
import { SessionsQueryRepository } from './sessions/infrastructure/session.query-repository';
import { TerminateAllSessionsUseCase } from './sessions/application/useCases/terminate-all-sessions.usecase';
import { TerminateSessionUseCase } from './sessions/application/useCases/terminate-session-by-id.usecase';
import { LogoutUserUseCase } from './application/useCases/logout-user.usecase';

const useCases = [
  LoginUserUseCase,
  RefreshTokenUseCase,
  TerminateAllSessionsUseCase,
  TerminateSessionUseCase,
  LogoutUserUseCase,
];

@Module({
  imports: [
    MongooseModule.forFeature([
      { name: User.name, schema: UserSchema },
      { name: Session.name, schema: sessionSchema },
    ]),
    NotificationsModule,
    JwtModule,
  ],
  controllers: [UsersController, AuthController, SessionsController],
  providers: [
    UsersService,
    UsersRepository,
    UsersQueryRepository,
    BcryptService,
    AuthService,
    LocalStrategy,
    JwtStrategy,
    RtJwtStrategy,
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
    SessionsRepository,
    ...useCases,
    SessionsQueryRepository,
  ],
  exports: [MongooseModule, JwtStrategy, UsersRepository],
})
export class UserAccountsModule {}
