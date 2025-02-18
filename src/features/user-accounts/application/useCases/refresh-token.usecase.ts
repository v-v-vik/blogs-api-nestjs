import { Response } from 'express';
import { CommandHandler, ICommandHandler } from '@nestjs/cqrs';
import { Inject } from '@nestjs/common';
import {
  ACCESS_TOKEN_STRATEGY_INJECT_TOKEN,
  REFRESH_TOKEN_STRATEGY_INJECT_TOKEN,
} from '../../constants/auth-tokens.inject-constants';
import { JwtService } from '@nestjs/jwt';
import { RefreshTokenPayload } from '../../dto/tokens/tokens-payload.dto';
import { SQLSessionsRepository } from '../../sessions/infrastructure/session-sql.repository';

export class RefreshTokenCommand {
  constructor(
    public userData: RefreshTokenPayload,
    public res: Response,
  ) {}
}

@CommandHandler(RefreshTokenCommand)
export class RefreshTokenUseCase
  implements ICommandHandler<RefreshTokenCommand>
{
  constructor(
    private sqlSessionsRepository: SQLSessionsRepository,
    @Inject(ACCESS_TOKEN_STRATEGY_INJECT_TOKEN)
    private accessTokenContext: JwtService,
    @Inject(REFRESH_TOKEN_STRATEGY_INJECT_TOKEN)
    private refreshTokenContext: JwtService,
  ) {}

  async execute(
    command: RefreshTokenCommand,
  ): Promise<{ accessToken: string }> {
    const userId = command.userData.id;
    const newAccessToken = this.accessTokenContext.sign({
      id: userId,
    });
    const deviceId = command.userData.deviceId;
    const newRefreshToken = this.refreshTokenContext.sign({
      id: userId,
      deviceId,
    });
    const newTokenData = this.refreshTokenContext.decode(newRefreshToken) as {
      iat: number;
    };
    const foundSession =
      await this.sqlSessionsRepository.findByDeviceIdOrNotFoundException(
        deviceId,
      );
    foundSession.update(newTokenData.iat.toString());
    await this.sqlSessionsRepository.update(foundSession);

    command.res.cookie('refreshToken', newRefreshToken, {
      httpOnly: true,
      secure: true,
    });
    return { accessToken: newAccessToken };
  }
}
