import { Injectable, PipeTransform } from '@nestjs/common';
import { BadRequestDomainException } from '../exceptions/domain-exceptions';

@Injectable()
export class ParamsIdValidationPipe implements PipeTransform {
  transform(value: string): string {
    const id = Number(value);

    if (isNaN(id) || id <= 0 || !Number.isInteger(id)) {
      throw BadRequestDomainException.create(
        'Id must be a valid positive integer',
      );
    }

    return id.toString();
  }
}
