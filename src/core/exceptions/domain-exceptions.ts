import { DomainExceptionCode } from './domain-exception-codes';

export class ErrorExtension {
  constructor(
    public message: string,
    public field: string | null = null,
  ) {}
}

export class DomainException extends Error {
  constructor(
    public message: string,
    public code: DomainExceptionCode,
    public extensions: ErrorExtension[],
  ) {
    super(message);
  }
}

function ConcreteDomainExceptionFactory(
  commonMessage: string,
  code: DomainExceptionCode,
) {
  return class extends DomainException {
    constructor(extensions: ErrorExtension[]) {
      super(commonMessage, code, extensions);
    }
    static create(message?: string, key?: string) {
      return new this(message ? [new ErrorExtension(message, key)] : []);
    }
    static createWithArray(extensions: ErrorExtension[]) {
      return new this(extensions);
    }
  };
}

export const NotFoundDomainException = ConcreteDomainExceptionFactory(
  'Not Found',
  DomainExceptionCode.NotFound,
);

export const BadRequestDomainException = ConcreteDomainExceptionFactory(
  'BadRequest',
  DomainExceptionCode.BadRequest,
);

export const ForbiddenDomainException = ConcreteDomainExceptionFactory(
  'Forbidden',
  DomainExceptionCode.Forbidden,
);

export const UnauthorizedDomainException = ConcreteDomainExceptionFactory(
  'Unauthorized',
  DomainExceptionCode.Unauthorized,
);

export const TooManyRequestsDomainException = ConcreteDomainExceptionFactory(
  'TooManyRequests',
  DomainExceptionCode.TooManyRequests,
);

// export class BadRequestDomainException extends DomainException {
//   constructor(extensions: ErrorExtension[]) {
//     super('Bad Request', DomainExceptionCode.BedRequest, extensions);
//   }
//
//   static create(message: string, key?: string) {
//     return new this(message ? [new ErrorExtension(message, key)] : []);
//   }
// }
//
// export class ForbiddenDomainException extends DomainException {
//   constructor(extensions: ErrorExtension[]) {
//     super('Forbidden', DomainExceptionCode.Forbidden, extensions);
//   }
//
//   static create(message?: string, key?: string) {
//     return new this(message ? [new ErrorExtension(message, key)] : []);
//   }
// }
//
// export class UnauthorizedDomainException extends DomainException {
//   constructor(extensions: ErrorExtension[]) {
//     super('Unauthorized', DomainExceptionCode.Unauthorized, extensions);
//   }
//
//   static create(message: string, key?: string) {
//     return new this(message ? [new ErrorExtension(message, key)] : []);
//   }
// }
