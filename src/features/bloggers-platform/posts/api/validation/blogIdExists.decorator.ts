import { Injectable } from '@nestjs/common';
import {
  registerDecorator,
  ValidationArguments,
  ValidationOptions,
  ValidatorConstraint,
  ValidatorConstraintInterface,
} from 'class-validator';
import { BlogsRepository } from '../../../blogs/infrastructure/blog.repository';

@ValidatorConstraint({ name: 'blogIdExists', async: true })
@Injectable()
export class BlogIdExistsConstraint implements ValidatorConstraintInterface {
  constructor(private blogsRepository: BlogsRepository) {}

  async validate(value: any, args: ValidationArguments): Promise<boolean> {
    const blogExists =
      await this.blogsRepository.findByIdOrNotFoundException(value);
    return !!blogExists;
  }
  defaultMessage(validationArguments?: ValidationArguments): string {
    return `BlogId ${validationArguments?.value} does not exist`;
  }
}

export function BlogIdExists(
  property?: string,
  validationOptions?: ValidationOptions,
) {
  return function (object: object, propertyName: string) {
    registerDecorator({
      target: object.constructor,
      propertyName: propertyName,
      options: validationOptions,
      constraints: [property],
      validator: BlogIdExistsConstraint,
    });
  };
}
