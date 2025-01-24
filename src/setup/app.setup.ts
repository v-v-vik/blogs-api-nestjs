import { INestApplication } from '@nestjs/common';
import { pipesSetup } from './pipes.setup';
import { swaggerSetup } from './swagger.setup';
import { exceptionFilterSetup } from './exception-filter.setup';
import cookieParser from 'cookie-parser';
import { validationConstraintSetup } from './validation-constraint.setup';
import { CoreConfig } from '../core/core.config';

export function appSetup(app: INestApplication, coreConfig: CoreConfig) {
  app.enableCors({ origin: true, credentials: true });
  app.use(cookieParser());
  pipesSetup(app);
  swaggerSetup(app);
  //globalPrefixSetup(app);
  exceptionFilterSetup(app);
  validationConstraintSetup(app, coreConfig);
}
