import { Module } from '@nestjs/common';
import { EmailService } from './email.service';
import { MailerModule } from '@nestjs-modules/mailer';
import { EmailTemplates } from './email.templates';

@Module({
  imports: [
    MailerModule.forRoot({
      transport: {
        host: 'smtp.gmail.com',
        port: 465,
        secure: true,
        auth: {
          user: 'veradev1327@gmail.com',
          pass: 'mowh qhfq addx qdvr',
        },
      },
      defaults: {
        from: '"No Reply" <no-reply@localhost.com>',
      },
    }),
  ],
  controllers: [],
  providers: [EmailService, EmailTemplates],
  exports: [EmailService],
})
export class NotificationsModule {}
