import { EmailService } from '../../src/features/notifications/email.service';

export class EmailServiceMock extends EmailService {
  async sendConfirmationEmail(email: string, code: string): Promise<void> {
    console.log(
      'Call mock method sendConfirmationEmail / EmailServiceMock',
      `email: ${email} received, code ${code} received`,
    );

    return;
  }
  async sendPasswordRecoveryEmail(email: string, code: string): Promise<void> {
    console.log(
      'Call mock method sendPasswordRecoveryEmail / EmailServiceMock',
      `email: ${email} received, code ${code} received`,
    );

    return;
  }
}
