import isLength from 'validator/lib/isLength';
import ValidationError from './ValidationError';

export default function validatePasswordChange(
  password: string,
  confirmPassword: string,
): Array<ValidationError> {
  const validationErrors: Array<ValidationError> = [];

  if (!password || !isLength(password, { min: 8, max: 255 })) {
    validationErrors.push({
      field: 'password',
      message: 'Password must be at minimum 8 and at maximum 255 characters in length.',
    });
  }

  if (password !== confirmPassword) {
    validationErrors.push({
      field: 'confirmPassword',
      message: 'Passwords do not match.',
    });
  }

  return validationErrors;
}
