import { Injectable } from '@nestjs/common';
import { ConfigService } from '@nestjs/config';
import { configValidationUtility } from '../../../setup/config-validation.utility';
import { IsNotEmpty } from 'class-validator';

@Injectable()
export class NotificationsConfig {
  @IsNotEmpty({
    message:
      'Set Env variable EMAIL_SERVICE, email address which sends out notifications',
  })
  emailService: string = this.configService.get('EMAIL_SERVICE');

  @IsNotEmpty({
    message: 'Set Env variable EMAIL_SERVICE_PASSWORD, !!sensitive data!!',
  })
  emailServicePassword: string = this.configService.get(
    'EMAIL_SERVICE_PASSWORD',
  );

  constructor(private configService: ConfigService<any, true>) {
    configValidationUtility.validateConfig(this);
  }
}
