import React, { useState, useEffect } from 'react';
import { BsCheckBox } from 'react-icons/bs';

import getConfig from 'next/config';
import Link from 'next/link';
import { useRouter } from 'next/router';

import Alert from 'react-bootstrap/Alert';
import Container from 'react-bootstrap/Container';
import Form from 'react-bootstrap/Form';

import { useForm } from 'react-hook-form';

import isEmail from 'validator/lib/isEmail';

import LoadingButton from '../../../components/LoadingButton';
import useIsAuthenticated from '../../../hooks/useIsAuthenticated';

export default function ForgotPassword(): JSX.Element {
  const { publicRuntimeConfig: { appName } } = getConfig();
  const [submitted, setSubmitted] = useState<boolean>(false);
  const [loading, setLoading] = useState<boolean>(false);
  const {
    register, handleSubmit, errors, setError,
  } = useForm();
  const router = useRouter();

  const { data: isAuthenticatedData } = useIsAuthenticated();
  useEffect(() => { if (isAuthenticatedData && isAuthenticatedData.isAuthenticated) router.replace('/'); }, [isAuthenticatedData]);

  const onSubmit = async (data: any): Promise<void> => {
    if (loading) return;
    setLoading(true);
    try {
      const res = await fetch('/api/account/forgot-password', {
        body: JSON.stringify(data),
        headers: {
          'Content-Type': 'application/json',
        },
        method: 'POST',
      });

      switch (res.status) {
        case 200:
          setSubmitted(true);
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
          throw new Error('An unknown error has occured. Please try again later.');
      }
    } catch (err) {
      setError('unknown', 'unknown');
      setLoading(false);
    }
  };

  const PostSubmit = (
    <>
      <Alert variant="success">
        <BsCheckBox />
        &nbsp;We have sent you an email with password reset instructions,
        if the email address you&apos;ve entered exists in our system.
      </Alert>
      <p>
        Please check your spam folder if you did not receive an email.
      </p>
      <p>
        Otherwise, you will have to wait 30 minutes for your previous password
        reset request to expire before being able to request another.
      </p>
      <p className="text-center">
        <Link href="/account/login"><a>Proceed to Login</a></Link>
      </p>
    </>
  );

  return (
    <Container className="ml-auto mr-auto mt-5" style={{ maxWidth: '420px' }}>
      <div className="text-center">
        <h1 className="h3">Forgot Password</h1>
        {errors.unknown && (
          <Alert variant="danger">{errors.unknown.message}</Alert>
        )}
      </div>

      {
        submitted ? PostSubmit : (
          <>
            <p>
              Please provide the email address you&apos;ve used when you signed up for your&nbsp;
              {appName}
              &nbsp;account.
            </p>
            <p>We will send you an email with instructions on how to reset your password.</p>

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
              </Form.Group>

              <LoadingButton loading={loading}>Reset Password</LoadingButton>

            </Form>
          </>
        )
      }
    </Container>
  );
}
