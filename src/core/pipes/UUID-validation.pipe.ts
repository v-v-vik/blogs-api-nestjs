import { Injectable, PipeTransform } from '@nestjs/common';
import { NotFoundDomainException } from '../exceptions/domain-exceptions';
import { isUUID } from 'class-validator';

@Injectable()
export class UUIDValidationPipe implements PipeTransform {
  transform(value: string): string {
    if (!isUUID(value)) {
      throw NotFoundDomainException.create('Object id is not found');
    }
    return value;
  }
}
