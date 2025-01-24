import { NestFactory } from '@nestjs/core';
import { AppModule } from './app.module';
import { appSetup } from './setup/app.setup';
import { CoreConfig } from './core/core.config';

async function bootstrap() {
  const appContext = await NestFactory.create(AppModule);
  const coreConfig = appContext.get<CoreConfig>(CoreConfig);
  const DynamicAppModule = await AppModule.forRoot(coreConfig);

  const app = await NestFactory.create(DynamicAppModule);

  const port = coreConfig.port;

  appSetup(app, coreConfig);
  await app.listen(port, () => {
    console.log(`App listening on port ${port}`);
    console.log('NODE_ENV: ', coreConfig.env);
  });
}
bootstrap();
