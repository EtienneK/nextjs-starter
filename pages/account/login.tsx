import React, { useState, useEffect } from 'react';
import { FiLogIn } from 'react-icons/fi';

import Link from 'next/link';
import { useRouter } from 'next/router';

import Alert from 'react-bootstrap/Alert';
import Container from 'react-bootstrap/Container';
import Form from 'react-bootstrap/Form';

import { useForm } from 'react-hook-form';

import isEmail from 'validator/lib/isEmail';

import LoadingButton from '../../components/LoadingButton';
import useIsAuthenticated from '../../hooks/useIsAuthenticated';

export default function Login(): JSX.Element {
  const [loading, setLoading] = useState<boolean>(false);
  const {
    register, handleSubmit, errors, setError,
  } = useForm();
  const router = useRouter();

  const { data: isAuthenticatedData, mutate } = useIsAuthenticated();
  useEffect(() => { if (isAuthenticatedData && isAuthenticatedData.isAuthenticated) router.replace('/'); }, [isAuthenticatedData]);

  const onSubmit = async (data: any): Promise<void> => {
    if (loading) return;
    setLoading(true);
    try {
      const res = await fetch('/api/account/login', {
        body: JSON.stringify(data),
        headers: {
          'Content-Type': 'application/json',
        },
        method: 'POST',
      });

      switch (res.status) {
        case 200:
          mutate(true);
          router.replace('/');
          break;
        case 401: {
          setError('unknown', 'invalid', 'Invalid email address or password. Please try again.');
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

  return (
    <Container className="ml-auto mr-auto mt-5" style={{ maxWidth: '420px' }}>
      <div className="text-center">
        <h1 className="h3">Login</h1>
        {errors.unknown && (
          <Alert variant="danger">{errors.unknown.message}</Alert>
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
        </Form.Group>

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
              minLength: 8,
              maxLength: 255,
            })}
          />
        </Form.Group>

        <p className="float-right">
          <Link href="/account/forgot-password"><a>Forgot password?</a></Link>
        </p>

        <LoadingButton loading={loading}>
          <FiLogIn />
          &nbsp;Login
        </LoadingButton>

        <div className="mt-4 text-center">
          <p className="m-0">Don&apos;t have an account yet?</p>
          <p>
            <Link href="/account/register">
              <a className="font-weight-bold">Sign up</a>
            </Link>
          </p>
        </div>
      </Form>
    </Container>
  );
}
