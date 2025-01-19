import { INestApplication } from '@nestjs/common';
import { AllExceptionsFilter } from '../core/exceptions/filters/all-exceptions-filter';
import { DomainExceptionsFilter } from '../core/exceptions/filters/domain-exceptions-filter';

export function exceptionFilterSetup(app: INestApplication) {
  app.useGlobalFilters(new AllExceptionsFilter(), new DomainExceptionsFilter());
}

//filters in useGlobalFilters method are called from right to left
//DomainExceptionFilter is in the file but not used
