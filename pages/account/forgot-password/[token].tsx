import React, { useState, useEffect } from 'react';

import Link from 'next/link';
import { useRouter } from 'next/router';

import Alert from 'react-bootstrap/Alert';
import Form from 'react-bootstrap/Form';
import Spinner from 'react-bootstrap/Spinner';
import { useForm } from 'react-hook-form';

import LoadingButton from '../../../components/LoadingButton';
import useIsAuthenticated from '../../../hooks/useIsAuthenticated';
import PasswordChange from '../../../components/PasswordChange';
import AccountContainer from '../../../components/AccountContainer';

enum CurrentState {
  CheckingToken,
  ResetPasswordForm,
  Loading,
  Success,
  Expired,
  Unknown,
}

export default function ForgotPasswordReset(): JSX.Element {
  const router = useRouter();
  const { token } = router.query;

  const [currentState, setCurrentState] = useState<CurrentState>(CurrentState.CheckingToken);

  useEffect((): void => {
    if (!token) return;
    if (currentState !== CurrentState.CheckingToken) return;

    fetch(`/api/account/forgot-password/${token}`)
      .then((res) => {
        switch (res.status) {
          case 200:
            setCurrentState(CurrentState.ResetPasswordForm);
            break;
          case 404:
            setCurrentState(CurrentState.Expired);
            break;
          default:
            setCurrentState(CurrentState.Unknown);
        }
      });
  }, [token]);

  const {
    register, handleSubmit, watch, errors, setError,
  } = useForm();

  const { data: isAuthenticatedData } = useIsAuthenticated();
  useEffect(() => { if (isAuthenticatedData && isAuthenticatedData.isAuthenticated) router.replace('/'); }, [isAuthenticatedData]);

  const onSubmit = async (data: any): Promise<void> => {
    if (currentState === CurrentState.Loading) return;
    setCurrentState(CurrentState.Loading);
    try {
      const res = await fetch(`/api/account/forgot-password/${token}`, {
        body: JSON.stringify({ ...data, token }),
        headers: {
          'Content-Type': 'application/json',
        },
        method: 'POST',
      });

      switch (res.status) {
        case 200:
          setCurrentState(CurrentState.Success);
          break;
        case 400: {
          const body = await res.json();
          body.validationErrors.forEach((validationError) => {
            setError(validationError.field, 'server', validationError.message);
          });
          setCurrentState(CurrentState.ResetPasswordForm);
          break;
        }
        case 404:
          break;
        default:
          throw new Error('An unknown error has occured.');
      }
    } catch (err) {
      setError('unknown', 'unknown');
      setCurrentState(CurrentState.ResetPasswordForm);
    }
  };

  if (currentState === CurrentState.CheckingToken) {
    return (
      <AccountContainer className="text-center">
        <Spinner animation="border" />
      </AccountContainer>
    );
  }

  if (currentState === CurrentState.ResetPasswordForm || currentState === CurrentState.Loading) {
    return (
      <AccountContainer>
        <div className="text-center">
          <h1 className="h3">Forgot password reset</h1>
          {errors.unknown && (
            <Alert variant="danger">An unknown error has occured. Please try again later.</Alert>
          )}
        </div>

        <p>Please enter and confirm your new password below.</p>

        <Form onSubmit={handleSubmit(onSubmit)} noValidate>

          <PasswordChange
            loading={currentState === CurrentState.Loading}
            register={register}
            watch={watch}
            errors={errors}
          />

          <LoadingButton loading={currentState === CurrentState.Loading}>
            Reset Password
          </LoadingButton>

        </Form>
      </AccountContainer>
    );
  }

  if (currentState === CurrentState.Success) {
    return (
      <AccountContainer>
        <Alert variant="success">
          <p>Your password has successfully been reset.</p>
          <p className="text-center"><Link href="/account/login"><a>Proceed to Login</a></Link></p>
        </Alert>
      </AccountContainer>
    );
  }

  if (currentState === CurrentState.Expired) {
    return (
      <AccountContainer>
        <Alert variant="warning">
          <p>Your forgot password reset request has expired.</p>
          <p className="text-center"><Link href="/account/forgot-password"><a>Send another reset request</a></Link></p>
        </Alert>
      </AccountContainer>
    );
  }

  return (
    <AccountContainer>
      <Alert variant="danger">An unknown error has occured. Please try again later.</Alert>
    </AccountContainer>
  );
}
