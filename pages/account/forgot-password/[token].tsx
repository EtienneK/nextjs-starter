import React, { useState, useEffect } from 'react';

import { useRouter } from 'next/router';

import Alert from 'react-bootstrap/Alert';
import Container from 'react-bootstrap/Container';
import Form from 'react-bootstrap/Form';

import { useForm } from 'react-hook-form';

import LoadingButton from '../../../components/LoadingButton';
import useIsAuthenticated from '../../../hooks/useIsAuthenticated';
import PasswordChange from '../../../components/PasswordChange';

export default function ForgotPasswordReset(): JSX.Element {
  const [loading, setLoading] = useState<boolean>(false);
  const {
    register, handleSubmit, watch, errors, setError,
  } = useForm();
  const router = useRouter();
  const { token } = router.query;

  const { data: isAuthenticatedData, mutate } = useIsAuthenticated();
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
        method: 'PATCH',
      });

      switch (res.status) {
        case 201:
          mutate(true);
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
    <Container className="ml-auto mr-auto mt-5" style={{ maxWidth: '420px' }}>
      <div className="text-center">
        <h1 className="h3">Forgot password reset</h1>
        {errors.unknown && (
          <Alert variant="danger">An unknown error has occured. Please try again later.</Alert>
        )}
      </div>

      <p>Please enter and confirm your new password below.</p>

      <Form onSubmit={handleSubmit(onSubmit)} noValidate>

        <PasswordChange
          loading={loading}
          register={register}
          watch={watch}
          errors={errors}
        />

        <input ref={register()} type="hidden" name="token" value={token} />

        <LoadingButton loading={loading}>
          Reset Password
        </LoadingButton>

      </Form>
    </Container>
  );
}
