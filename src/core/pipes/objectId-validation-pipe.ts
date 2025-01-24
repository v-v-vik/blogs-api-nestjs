import { Injectable, PipeTransform } from '@nestjs/common';
import { isValidObjectId } from 'mongoose';
import { BadRequestDomainException } from '../exceptions/domain-exceptions';

@Injectable()
export class ObjectIdValidationPipe implements PipeTransform {
  transform(value: string): string {
    if (!isValidObjectId(value)) {
      throw BadRequestDomainException.create('Object id is invalid');
    }
    return value;
  }
}
