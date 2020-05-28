import React, { useState, useEffect } from 'react';
import { BsPersonPlus } from 'react-icons/bs';

import Link from 'next/link';
import { useRouter } from 'next/router';

import Alert from 'react-bootstrap/Alert';
import Form from 'react-bootstrap/Form';

import { useForm } from 'react-hook-form';

import isEmail from 'validator/lib/isEmail';

import LoadingButton from '../../components/LoadingButton';
import useCurrentUser from '../../hooks/useCurrentUser';
import PasswordChange from '../../components/PasswordChange';
import AccountContainer from '../../components/AccountContainer';

export default function SignUp(): JSX.Element {
  const [loading, setLoading] = useState<boolean>(false);
  const {
    register, handleSubmit, watch, errors, setError,
  } = useForm();
  const router = useRouter();

  const { wrappedUser, mutate } = useCurrentUser();
  useEffect(() => { if (wrappedUser?.user) router.replace('/'); }, [wrappedUser]);

  const onSubmit = async (data: any): Promise<void> => {
    if (loading) return;
    setLoading(true);
    try {
      const res = await fetch('/api/account/register', {
        body: JSON.stringify(data),
        headers: {
          'Content-Type': 'application/json',
        },
        method: 'POST',
      });

      switch (res.status) {
        case 201:
          mutate(await res.json());
          router.replace('/');
          break;
        case 400: {
          const body = await res.json();
          body.validationErrors.forEach((validationError) => {
            setError(validationError.field, 'server', validationError.message);
          });
          setLoading(false);
          break;
        }
        default:
          throw new Error('An unknown error has occured.');
      }
    } catch (err) {
      setError('unknown', 'unknown');
      setLoading(false);
    }
  };

  return (
    <AccountContainer>
      <div className="text-center">
        <h1 className="h3">Sign up</h1>
        {errors.unknown && (
          <Alert variant="danger">An unknown error has occured. Please try again later.</Alert>
        )}
      </div>

      <Form onSubmit={handleSubmit(onSubmit)} noValidate>

        <Form.Group>
          <Form.Label>Email address</Form.Label>
          <Form.Control
            name="email"
            type="email"
            placeholder="Email address"
            autoFocus
            disabled={loading}
            maxLength={255}
            isInvalid={errors.email}
            ref={register({
              required: true,
              minLength: 5,
              maxLength: 255,
              validate: isEmail,
            })}
          />
          <Form.Control.Feedback type="invalid">
            {errors.email?.message ? errors.email.message : 'Please enter a valid email address.'}
          </Form.Control.Feedback>
        </Form.Group>

        <PasswordChange
          loading={loading}
          register={register}
          watch={watch}
          errors={errors}
        />

        <LoadingButton loading={loading}>
          <BsPersonPlus />
          &nbsp;Create account
        </LoadingButton>

        <div className="mt-4 text-center">
          <p className="m-0">Already have an account?</p>
          <p>
            <Link href="/account/login">
              <a className="font-weight-bold">Login</a>
            </Link>
          </p>
        </div>
      </Form>
    </AccountContainer>
  );
}
