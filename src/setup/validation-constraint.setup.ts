import { useContainer } from 'class-validator';
import { INestApplication } from '@nestjs/common';
import { AppModule } from '../app.module';
import { CoreConfig } from '../core/core.config';

export const validationConstraintSetup = async (
  app: INestApplication,
  coreConfig: CoreConfig,
) => {
  const appContext = app.select(await AppModule.forRoot(coreConfig));
  useContainer(appContext, { fallbackOnErrors: true });
};
