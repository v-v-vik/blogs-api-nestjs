import { BaseExceptionFilter } from './base-exception-filter';
import { Catch, HttpException, HttpStatus } from '@nestjs/common';
import { Response } from 'express';

@Catch()
export class AllExceptionsFilter extends BaseExceptionFilter {
  onCatch(exception: any, response: Response): void {
    const status =
      exception instanceof HttpException
        ? exception.getStatus()
        : HttpStatus.INTERNAL_SERVER_ERROR;
    //TODO: replace with Getter from ConfigService
    const isProduction = process.env.NODE_ENV === 'production';
    if (isProduction && status === HttpStatus.INTERNAL_SERVER_ERROR) {
      response.status(status).json({
        ...this.getDefaultHttpBody(exception),
        path: null,
        message: 'Some error occurred',
      });
      return;
    }

    console.log(exception);

    response.status(status).json(this.getDefaultHttpBody(exception));
  }
}
