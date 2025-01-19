import { INestApplication } from '@nestjs/common';
import { pipesSetup } from './pipes.setup';
import { swaggerSetup } from './swagger.setup';
import { exceptionFilterSetup } from './exception-filter.setup';
import cookieParser from 'cookie-parser';

export function appSetup(app: INestApplication) {
  app.enableCors();
  app.use(cookieParser());
  pipesSetup(app);
  swaggerSetup(app);
  //globalPrefixSetup(app);
  exceptionFilterSetup(app);
  //useContainer(app.select(AppModule)), { fallbackOnErrors: true };
}
