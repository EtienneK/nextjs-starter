import isEmail from 'validator/lib/isEmail';
import isLength from 'validator/lib/isLength';
import normalizeEmail from 'validator/lib/normalizeEmail';
import ValidationError from './ValidationError';

export function normaliseEmail(email: string): string | false {
  return normalizeEmail(email, { gmail_remove_dots: false });
}

export default function validateEmail(email: string): Array<ValidationError> {
  const validationErrors: Array<ValidationError> = [];
  if (!email || !isEmail(email)) {
    validationErrors.push({
      field: 'email',
      message: 'Please enter a valid email address.',
    });
  } else if (!isLength(email, { min: 5, max: 255 })) {
    validationErrors.push({
      field: 'email',
      message: 'Email must be at minimum 5 and at maximum 255 characters in length.',
    });
  }
  return validationErrors;
}
