import { Injectable } from '@nestjs/common';
import { configValidationUtility } from '../../../setup/config-validation.utility';
import { ConfigService } from '@nestjs/config';
import { IsNotEmpty } from 'class-validator';

@Injectable()
export class UserAccountsConfig {
  @IsNotEmpty({
    message: 'Set Env variable ACCESS_TOKEN_SECRET, essential for security',
  })
  accessTokenSecret: string = this.configService.get('ACCESS_TOKEN_SECRET');

  @IsNotEmpty({
    message: 'Set Env variable REFRESH_TOKEN_SECRET, essential for security',
  })
  refreshTokenSecret: string = this.configService.get('REFRESH_TOKEN_SECRET');

  @IsNotEmpty({
    message: 'Set Env variable ACCESS_TOKEN_EXPIRES_IN, examples: 1h, 5m, 2d',
  })
  accessTokenExpiresIn: string = this.configService.get(
    'ACCESS_TOKEN_EXPIRES_IN',
  );

  @IsNotEmpty({
    message: 'Set Env variable REFRESH_TOKEN_EXPIRES_IN, examples: 1h, 5m, 2d',
  })
  refreshTokenExpiresIn: string = this.configService.get(
    'REFRESH_TOKEN_EXPIRES_IN',
  );
  constructor(private configService: ConfigService<any, true>) {
    configValidationUtility.validateConfig(this);
  }
}
