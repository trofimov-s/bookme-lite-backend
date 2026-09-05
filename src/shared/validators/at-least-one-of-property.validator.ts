import {
  registerDecorator,
  type ValidationArguments,
  type ValidationOptions,
  ValidatorConstraint,
  type ValidatorConstraintInterface,
} from 'class-validator';

@ValidatorConstraint({ name: 'atLeastOneOfProperty' })
class AtLeastOneOfPropertyConstraint implements ValidatorConstraintInterface {
  validate(_: undefined, args: ValidationArguments) {
    const [fields] = args.constraints as string[][];

    return fields.some((field) => {
      const value = (args.object as Record<string, unknown>)[field];

      return value !== undefined && value !== null && value !== '';
    });
  }

  defaultMessage(args: ValidationArguments) {
    const [properties] = args.constraints as string[][];

    return `At least one of the following fields: ${properties.join(', ')} must be provided`;
  }
}

type Constructor = new (...args: unknown[]) => unknown;

export function AtLeastOneOfProperty(properties: string[], validationOptions?: ValidationOptions) {
  return function (target: Constructor) {
    registerDecorator({
      propertyName: '',
      target,
      options: validationOptions,
      constraints: [properties],
      validator: AtLeastOneOfPropertyConstraint,
    });
  };
}
