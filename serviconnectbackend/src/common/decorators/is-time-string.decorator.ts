import { registerDecorator, ValidationOptions, ValidationArguments } from 'class-validator';

export function IsTimeString(validationOptions?: ValidationOptions) {
  return function (object: Object, propertyName: string) {
    registerDecorator({
      name: 'isTimeString',
      target: object.constructor,
      propertyName: propertyName,
      options: validationOptions,
      validator: {
        validate(value: any, args: ValidationArguments) {
          return typeof value === 'string' && /^\d{2}:\d{2}(:\d{2})?$/.test(value);
        },
        defaultMessage(args: ValidationArguments) {
          return `${args.property} must be a valid time string (HH:MM or HH:MM:SS)`;
        },
      },
    });
  };
}
