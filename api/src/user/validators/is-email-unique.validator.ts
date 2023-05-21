import {
  ValidatorConstraintInterface,
  ValidatorConstraint,
  ValidationOptions,
  registerDecorator,
} from 'class-validator';
import { UserService } from '../user.service';
import { Injectable } from '@nestjs/common';

@ValidatorConstraint({ async: true })
@Injectable()
export class IsEmailUniqueConstraint implements ValidatorConstraintInterface {
  constructor(private userService: UserService) {}

  async validate(email: any) {
    const user = await this.userService.findUserByEmail(email);
    return !user?.id;
  }
}

export function IsEmailUnique(validationOptions?: ValidationOptions) {
  return function (object: object, propertyName: string) {
    registerDecorator({
      target: object.constructor,
      propertyName: propertyName,
      options: { message: 'email already exists', ...validationOptions },
      constraints: [],
      validator: IsEmailUniqueConstraint,
    });
  };
}
