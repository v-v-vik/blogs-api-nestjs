import { INestApplication } from '@nestjs/common';
import { pipesSetup } from './pipes.setup';
import { swaggerSetup } from './swagger.setup';
import { globalPrefixSetup } from './global-prefix.setup';

export function appSetup(app: INestApplication) {
  pipesSetup(app);
  swaggerSetup(app);
  globalPrefixSetup(app);
}
