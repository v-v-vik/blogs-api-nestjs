import { Injectable } from '@nestjs/common';
import { PassportStrategy } from '@nestjs/passport';
import { ExtractJwt, Strategy } from 'passport-jwt';
import { RefreshTokenPayload } from '../../dto/tokens/tokens-payload.dto';
import { Request } from 'express';
import { UserAccountsConfig } from '../../config/user-accounts.config';
import { SessionsRepository } from '../../sessions/infrastructure/session.repository';
import { UnauthorizedDomainException } from '../../../../core/exceptions/domain-exceptions';

@Injectable()
export class RtJwtStrategy extends PassportStrategy(Strategy, 'jwt-refresh') {
  constructor(
    private userAccountsConfig: UserAccountsConfig,
    private sessionsRepository: SessionsRepository,
  ) {
    const secret = userAccountsConfig.refreshTokenSecret;

    super({
      jwtFromRequest: ExtractJwt.fromExtractors([
        (request: Request) => {
          let token = null;
          if (request && request.cookies) {
            token = request.cookies['refreshToken'];
          }
          return token;
        },
      ]),
      ignoreExpiration: false,
      secretOrKey: secret,
    });
  }
  async validate(
    payload: RefreshTokenPayload,
  ): Promise<RefreshTokenPayload | boolean> {
    const isSessionListed = await this.sessionsRepository.tokenListed(payload);
    console.log(isSessionListed);
    console.log('payload: ', payload);
    if (isSessionListed) {
      return payload;
    }
    //return false;
    throw UnauthorizedDomainException.create('Refresh Token is not valid');
  }
}
