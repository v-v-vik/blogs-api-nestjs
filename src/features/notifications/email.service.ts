import { Injectable } from '@nestjs/common';
import { MailerService } from '@nestjs-modules/mailer';
import { EmailTemplates } from './email.templates';

@Injectable()
export class EmailService {
  constructor(
    private mailerService: MailerService,
    private emailTemplates: EmailTemplates,
  ) {}

  async sendRegistrationConfirmationEmail(
    email: string,
    code: string,
  ): Promise<void> {
    await this.mailerService.sendMail({
      to: email,
      subject: 'Confirm Your Registration',
      html: this.emailTemplates.registrationEmail(code),
    });
  }

  async sendPasswordRecoveryEmail(email: string, code: string): Promise<void> {
    await this.mailerService.sendMail({
      to: email,
      subject: 'Confirm Your Registration',
      html: this.emailTemplates.passwordRecoveryEmail(code),
    });
  }
}
