import {
  INestApplication,
  ValidationError,
  ValidationPipe,
} from '@nestjs/common';
import { BadRequestDomainException } from '../core/exceptions/domain-exceptions';

type ErrorResponse = { message: string; field: string };

export const errorFormatter = (
  errors: ValidationError[],
  errorMessage?: any,
): ErrorResponse[] => {
  const errorsForResponse = errorMessage || [];

  //console.log('initial errors:', errors);

  for (const error of errors) {
    if (!error?.constraints && error?.children?.length) {
      errorFormatter(error.children, errorsForResponse);
      //console.log('after recursion:', res);
    } else if (error?.constraints) {
      const constraintKeys = Object.keys(error.constraints);

      for (const key of constraintKeys) {
        errorsForResponse.push({
          message: error.constraints[key]
            ? `${error.constraints[key]}; Received value: ${error?.value}`
            : '',
          field: error.property,
        });
      }
    }
  }
  return errorsForResponse;
};

export function pipesSetup(app: INestApplication) {
  app.useGlobalPipes(
    new ValidationPipe({
      transform: true,
      stopAtFirstError: true,
      //to format error according to swagger docs
      exceptionFactory: (errors) => {
        const formattedErrors: any = errorFormatter(errors);

        throw BadRequestDomainException.createWithArray(formattedErrors);
      },
    }),
  );
}
