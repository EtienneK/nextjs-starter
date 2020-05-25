import React from 'react';
import Form from 'react-bootstrap/Form';
import { FieldErrors } from 'react-hook-form';

interface Props {
  loading: boolean;
  register: any;
  watch: (field: string) => string;
  errors: FieldErrors<Record<string, any>>;
}

export default function PasswordChange({
  loading,
  register,
  watch,
  errors,
}: Props): JSX.Element {
  return (
    <>
      <Form.Group>
        <Form.Label>Password</Form.Label>
        <Form.Control
          name="password"
          type="password"
          placeholder="Password"
          disabled={loading}
          maxLength={255}
          isInvalid={errors.password}
          ref={register({
            required: 'Please enter a password.',
            minLength: {
              value: 8,
              message: 'Password must be at least 8 characters in length.',
            },
            maxLength: 255,
          })}
        />
        <Form.Control.Feedback type="invalid">
          {errors.password?.message ? errors.password.message : 'Invalid password.'}
        </Form.Control.Feedback>
      </Form.Group>

      <Form.Group>
        <Form.Label>Confirm password</Form.Label>
        <Form.Control
          name="confirmPassword"
          type="password"
          placeholder="Confirm password"
          disabled={loading}
          maxLength={255}
          isInvalid={errors.confirmPassword}
          ref={register({
            required: 'Please confirm password.',
            validate: (data: string) => data === watch('password'),
          })}
        />
        <Form.Control.Feedback type="invalid">
          {errors.confirmPassword?.message ? errors.confirmPassword.message : 'Passwords do not match.'}
        </Form.Control.Feedback>
      </Form.Group>
    </>
  );
}
