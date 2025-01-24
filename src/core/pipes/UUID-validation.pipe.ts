import { Injectable, PipeTransform } from '@nestjs/common';
import { BadRequestDomainException } from '../exceptions/domain-exceptions';
import { isUUID } from 'class-validator';

@Injectable()
export class UUIDValidationPipe implements PipeTransform {
  transform(value: string): string {
    if (!isUUID(value)) {
      throw BadRequestDomainException.create('Object id is invalid');
    }
    return value;
  }
}
