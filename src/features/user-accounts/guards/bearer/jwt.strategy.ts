import { Injectable } from '@nestjs/common';
import { PassportStrategy } from '@nestjs/passport';
import { ExtractJwt, Strategy } from 'passport-jwt';
import { UserContextDto } from '../dto/user-context.dto';
import { UserAccountsConfig } from '../../config/user-accounts.config';

@Injectable()
export class JwtStrategy extends PassportStrategy(Strategy, 'jwt-access') {
  constructor(private userAccountsConfig: UserAccountsConfig) {
    const secret = userAccountsConfig.accessTokenSecret;
    super({
      jwtFromRequest: ExtractJwt.fromAuthHeaderAsBearerToken(),
      ignoreExpiration: false,
      secretOrKey: secret,
    });
  }
  async validate(payload: UserContextDto): Promise<UserContextDto> {
    return payload;
  }
}
