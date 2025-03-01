import { Module } from '@nestjs/common';
import { UsersController } from './api/users.controller';
import { UsersService } from './application/users.service';
import { BcryptService } from './application/bcrypt.service';
import { NotificationsModule } from '../notifications/notifications.module';
import { AuthController } from './api/auth.controller';
import { AuthService } from './application/auth.service';
import { JwtModule } from '@nestjs/jwt';
import { JwtStrategy } from './guards/bearer/jwt.strategy';
import { LocalStrategy } from './guards/local/local.strategy';
import { UserAccountsConfig } from './config/user-accounts.config';
import { RtJwtStrategy } from './guards/refresh-token/rt-jwt.strategy';
import { SessionsController } from './sessions/api/sessions.controller';
import { UsersRepository } from './infrastructure/user.repository';
import { UsersQueryRepository } from './infrastructure/user.query-repository';
import { SessionsRepository } from './sessions/infrastructure/session.repository';
import { SessionsQueryRepository } from './sessions/infrastructure/session.query-repository';
import { TypeOrmModule } from '@nestjs/typeorm';
import { User } from './domain/user.entity';
import { Session } from './sessions/domain/session.entity';
import { useCases } from './config/user-auth.useCase.providers';
import { jwtProviders } from './config/user.jwt.providers';

@Module({
  imports: [
    TypeOrmModule.forFeature([User, Session]),
    NotificationsModule,
    JwtModule,
  ],
  controllers: [UsersController, AuthController, SessionsController],
  providers: [
    UsersService,
    BcryptService,
    AuthService,
    LocalStrategy,
    JwtStrategy,
    RtJwtStrategy,
    UsersQueryRepository,
    UsersRepository,
    UserAccountsConfig,
    SessionsRepository,
    SessionsQueryRepository,
    ...useCases,
    ...jwtProviders,
  ],
  exports: [TypeOrmModule, JwtStrategy, UsersRepository],
})
export class UserAccountsModule {}
