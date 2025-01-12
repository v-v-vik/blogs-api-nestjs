import { Module } from '@nestjs/common';
import { EmailService } from './email.service';
import { MailerModule } from '@nestjs-modules/mailer';
import { EmailTemplates } from './email.templates';

@Module({
  imports: [
    MailerModule.forRoot({
      transport: 'smtps://veradev1327@gmail.com:mowh qhfq addx qdvr',
      defaults: {
        from: '"nest-modules" <modules@nestjs.com>',
      },
    }),
  ],
  controllers: [],
  providers: [EmailService, EmailTemplates],
  exports: [EmailService],
})
export class NotificationsModule {}
