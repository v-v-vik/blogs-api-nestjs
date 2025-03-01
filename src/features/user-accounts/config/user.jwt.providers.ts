import {
  ACCESS_TOKEN_STRATEGY_INJECT_TOKEN,
  REFRESH_TOKEN_STRATEGY_INJECT_TOKEN,
} from '../constants/auth-tokens.inject-constants';
import { UserAccountsConfig } from './user-accounts.config';
import { JwtService } from '@nestjs/jwt';

export const jwtProviders = [
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
];
