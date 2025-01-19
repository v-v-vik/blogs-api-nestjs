//config import should stay on top
import { configModule } from './config';
import { Module } from '@nestjs/common';
import { AppController } from './app.controller';
import { AppService } from './app.service';
import { UserAccountsModule } from './features/user-accounts/user-accounts.module';
import { MongooseModule } from '@nestjs/mongoose';
import { BloggersPlatformModule } from './features/bloggers-platform/bloggers-platform.module';
import { TestingModule } from './features/testing/testing.module';
import { NotificationsModule } from './features/notifications/notifications.module';
import { ThrottlerModule } from '@nestjs/throttler';
import { CqrsModule } from '@nestjs/cqrs';

@Module({
  imports: [
    configModule,
    MongooseModule.forRoot('mongodb://127.0.0.1:27017/my-app'),
    CqrsModule,
    UserAccountsModule,
    BloggersPlatformModule,
    TestingModule,
    NotificationsModule,
    ThrottlerModule.forRoot([
      {
        ttl: 10000,
        limit: 5,
      },
    ]),
  ],
  controllers: [AppController],
  providers: [AppService],
})
export class AppModule {}
