import { ArgumentsHost, ExceptionFilter } from '@nestjs/common';
import { Request, Response } from 'express';
import { DomainException, ErrorExtension } from '../domain-exceptions';

// export class HttpResponseBody {
//   timestamp: string;
//   path: string | null;
//   message: string;
//   extensions: ErrorExtension[];
//   code: DomainExceptionCode | null;
// }

export class HttpResponseBody {
  errorsMessages: ErrorExtension[];
}

export abstract class BaseExceptionFilter implements ExceptionFilter {
  abstract onCatch(exception: any, response: Response, request: Request): void;

  catch(exception: any, host: ArgumentsHost): any {
    const context = host.switchToHttp();
    const response: Response = context.getResponse();
    const request: Request = context.getRequest();

    this.onCatch(exception, response, request);
  }

  getDefaultHttpBody(exception: any) {
    const errorsMessages: { field: string; message: string }[] = [];

    if (exception instanceof DomainException) {
      exception.extensions.forEach((extension) => {
        errorsMessages.push({
          field: extension.field || 'unknown',
          message: extension.message || 'An error occurred',
        });
      });
    }
    if (errorsMessages.length > 0) {
      return { errorsMessages: errorsMessages };
    }
    return [];

    // getDefaultHttpBody(url: string, exception: any): HttpResponseBody {
    //   console.log(exception);
    //   return {
    //     timestamp: new Date().toDateString(),
    //     path: url,
    //     message: (exception as any).message || 'Internal server error',
    //     code: exception instanceof DomainException ? exception.code : null,
    //     extensions:
    //       exception instanceof DomainException ? exception.extensions : [],
    //   };
  }
}
