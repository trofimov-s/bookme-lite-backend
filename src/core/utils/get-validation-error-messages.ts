import type { ValidationError } from 'class-validator';

export function getValidationErrorMessages(validationErrors: ValidationError[]): string[] {
  const messages = validationErrors.flatMap((error) => {
    const constraintMessages = Object.values(error.constraints ?? {});
    const childrenMessages = error.children?.length ? getValidationErrorMessages(error.children) : [];

    return [...constraintMessages, ...childrenMessages];
  });

  return messages.length > 0 ? messages : ['Validation failed'];
}
