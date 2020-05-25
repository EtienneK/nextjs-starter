import React from 'react';
import Form from 'react-bootstrap/Form';
import isEmail from 'validator/lib/isEmail';
import { FieldErrors } from 'react-hook-form';

interface Props {
  autoFocus?: boolean;
  disabled: boolean;
  register: any;
  value?: string;
  errors: FieldErrors<Record<string, any>>;
}

export default function EmailInput({
  autoFocus = false,
  disabled,
  register,
  value,
  errors,
}: Props): JSX.Element {
  return (
    <Form.Group>
      <Form.Label>Email address</Form.Label>
      <Form.Control
        name="email"
        type="email"
        placeholder="Email address"
        autoFocus={autoFocus}
        disabled={disabled}
        maxLength={255}
        isInvalid={errors.email}
        ref={register({
          required: true,
          minLength: 5,
          maxLength: 255,
          validate: isEmail,
        })}
        defaultValue={value}
      />
      <Form.Control.Feedback type="invalid">
        {errors.email?.message ? errors.email.message : 'Please enter a valid email address.'}
      </Form.Control.Feedback>
    </Form.Group>
  );
}
