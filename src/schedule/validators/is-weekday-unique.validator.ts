import {
  registerDecorator,
  type ValidationOptions,
  ValidatorConstraint,
  type ValidatorConstraintInterface,
} from 'class-validator';

import type { ScheduleDayRequestDto } from '../dto';

@ValidatorConstraint({ name: 'isWeekdayUnique', async: false })
class IsWeekdayUniqueConstraint implements ValidatorConstraintInterface {
  validate(days: ScheduleDayRequestDto[]): Promise<boolean> | boolean {
    const weekdays = days.map((item) => item.weekday);
    const length = new Set(weekdays).size;

    return length === days.length;
  }

  defaultMessage(): string {
    return 'Days must have unique weekday value';
  }
}

export function IsWeekdaysUnique(validationOptions?: ValidationOptions) {
  return function (object: object, propertyName: string) {
    registerDecorator({
      propertyName,
      options: validationOptions,
      target: object.constructor,
      validator: IsWeekdayUniqueConstraint,
    });
  };
}
