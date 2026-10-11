import { ValidationError } from 'class-validator';

export function flattenValidationErrors(errors: ValidationError[]): string[] {
  const messages: string[] = [];

  for (const err of errors) {
    if (err.constraints) {
      messages.push(...Object.values(err.constraints));
    }
    if (err.children) {
      messages.push(...flattenValidationErrors(err.children));
    }
  }

  return messages;
}
