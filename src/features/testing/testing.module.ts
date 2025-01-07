import { Module } from '@nestjs/common';
import { TestingController } from './testing.controller';
import { BloggersPlatformModule } from '../bloggers-platform/bloggers-platform.module';
import { UserAccountsModule } from '../user-accounts/user-accounts.module';

@Module({
  imports: [BloggersPlatformModule, UserAccountsModule],
  controllers: [TestingController],
})
export class TestingModule {}
