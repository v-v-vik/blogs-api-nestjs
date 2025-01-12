import { BadRequestException, Injectable, PipeTransform } from '@nestjs/common';
import { isValidObjectId } from 'mongoose';

@Injectable()
export class ObjectIdValidationPipe implements PipeTransform {
  transform(value: string): string {
    if (!isValidObjectId(value)) {
      throw new BadRequestException('Object id is invalid');
    }
    return value;
  }
}
