import {
  registerDecorator,
  type ValidationArguments,
  type ValidationOptions,
  ValidatorConstraint,
  type ValidatorConstraintInterface,
} from 'class-validator';

@ValidatorConstraint({ name: 'isBeforeEndTime', async: false })
class IsBeforeEndtimeConstraint implements ValidatorConstraintInterface {
  validate(startTime: number, validationArguments: ValidationArguments): boolean {
    const object = validationArguments.object as { endTime: number };

    return startTime < object.endTime;
  }

  defaultMessage(): string {
    return 'startTime must be before endTime';
  }
}

export function IsBeforeEndTime(validationOptions?: ValidationOptions) {
  return function (object: object, propertyName: string) {
    registerDecorator({
      target: object.constructor,
      propertyName,
      options: validationOptions,
      validator: IsBeforeEndtimeConstraint,
    });
  };
}
