import { CommandHandler, ICommandHandler } from '@nestjs/cqrs';
import { Inject } from '@nestjs/common';
import {
  ACCESS_TOKEN_STRATEGY_INJECT_TOKEN,
  REFRESH_TOKEN_STRATEGY_INJECT_TOKEN,
} from '../../constants/auth-tokens.inject-constants';
import { JwtService } from '@nestjs/jwt';
import { randomUUID } from 'node:crypto';
import { Response } from 'express';
import { RefreshTokenPayload } from '../../dto/tokens/tokens-payload.dto';
import { SessionsRepository } from '../../sessions/infrastructure/session.repository';
import { Session } from '../../sessions/domain/session.entity';

export class LoginUserCommand {
  constructor(
    public userId: string,
    public res: Response,
    public ip: string,
    public deviceName: string,
  ) {}
}

@CommandHandler(LoginUserCommand)
export class LoginUserUseCase implements ICommandHandler<LoginUserCommand> {
  constructor(
    private sessionsRepository: SessionsRepository,
    @Inject(ACCESS_TOKEN_STRATEGY_INJECT_TOKEN)
    private accessTokenContext: JwtService,
    @Inject(REFRESH_TOKEN_STRATEGY_INJECT_TOKEN)
    private refreshTokenContext: JwtService,
  ) {}

  async execute(command: LoginUserCommand): Promise<{ accessToken: string }> {
    const accessToken = this.accessTokenContext.sign({
      id: command.userId,
    });
    const deviceId = randomUUID();
    const refreshToken = this.refreshTokenContext.sign({
      id: command.userId,
      deviceId,
    });
    const tokenData = this.refreshTokenContext.decode(
      refreshToken,
    ) as RefreshTokenPayload;
    const domainDto = {
      ip: command.ip,
      title: command.deviceName,
      lastActiveDate: tokenData.iat.toString(),
      deviceId,
      userId: command.userId,
      expDate: tokenData.exp.toString(),
    };
    const newSession = Session.createNewInstance(domainDto);
    await this.sessionsRepository.save(newSession);
    command.res.cookie('refreshToken', refreshToken, {
      httpOnly: true,
      secure: true,
    });
    return { accessToken };
  }
}
