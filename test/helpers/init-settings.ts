import { Test, TestingModuleBuilder } from '@nestjs/testing';
import { AppModule } from '../../src/app.module';
import { EmailService } from '../../src/features/notifications/email.service';
import { appSetup } from '../../src/setup/app.setup';
import { Connection } from 'mongoose';
import { getConnectionToken } from '@nestjs/mongoose';
import { EmailServiceMock } from '../mock/email-service.mock';
import {
  BlogsTestManager,
  PostsTestManager,
} from './entities manager/blog-post.creator';
import { UsersTestManager } from './entities manager/users.manager';
import { CommentsTestManager } from './entities manager/comments.creator';

export const initSettings = async (
  addSettingToModuleBuilder?: (moduleBuilder: TestingModuleBuilder) => void,
) => {
  const testingModuleBuilder: TestingModuleBuilder = Test.createTestingModule({
    imports: [
      AppModule,
      //MongooseModule.forRoot('mongodb://127.0.0.1:27017/test'),
    ],
  })
    .overrideProvider(EmailService)
    .useClass(EmailServiceMock);
  if (addSettingToModuleBuilder) {
    addSettingToModuleBuilder(testingModuleBuilder);
  }
  const testingAppModule = await testingModuleBuilder.compile();

  const app = testingAppModule.createNestApplication();
  appSetup(app);
  await app.init();
  const databaseConnection = app.get<Connection>(getConnectionToken());
  const httpServer = app.getHttpServer();
  const usersTestManager = new UsersTestManager(app, databaseConnection);
  const blogsTestManager = new BlogsTestManager(databaseConnection);
  const postsTestManager = new PostsTestManager(databaseConnection);
  const commentsTestManager = new CommentsTestManager(databaseConnection);

  return {
    app,
    databaseConnection,
    httpServer,
    usersTestManager,
    blogsTestManager,
    postsTestManager,
    commentsTestManager,
  };
};
