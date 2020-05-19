import { useState } from 'react';

import Link from 'next/link';
import { useRouter } from 'next/router'

import Alert from 'react-bootstrap/Alert';
import Button from 'react-bootstrap/Button';
import Card from 'react-bootstrap/Card';
import Container from 'react-bootstrap/Container';
import Form from 'react-bootstrap/Form';
import Spinner from 'react-bootstrap/Spinner';

import { useForm } from 'react-hook-form';

import isEmail from 'validator/lib/isEmail';


function LoadingButton({ children, loading, loadingText = 'Please wait...' }) {
  return (
    <Button variant="primary" size="lg" block={true} className="mt-4" type="submit">
      {loading && (<Spinner animation="border" size="sm" />)}
      {loading && ` ${loadingText}`}
      {!loading && (children)}
    </Button>
  );
}

export default function SignUp() {
  const [loading, setLoading] = useState<boolean>(false);
  const { register, handleSubmit, watch, errors, setError } = useForm();
  const router = useRouter();

  const onSubmit = async (data) => {
    if (loading) return;
    setLoading(true);
    try {
      const res = await fetch('/api/account/sign-up', {
        body: JSON.stringify(data),
        headers: {
          'Content-Type': 'application/json'
        },
        method: 'POST'
      });

      switch (res.status) {
        case 201:
          router.replace('/');
          break;
        case 400:
          const body = await res.json();
          body.validationErrors.forEach((validationError) => {
            setError(validationError.field, 'server', validationError.message);
          });
          setLoading(false);
          break;
        default:
          throw new Error('An unknown error has occured.');
      }
    } catch (err) {
      console.log(err);
      setError('unknown', 'unknown');
      setLoading(false);
    }
  };

  return (
    <Container className="ml-auto mr-auto mt-4" style={{ maxWidth: '360px' }}>
      <Card className="bg-light p-4">
        <div className="text-center">
          <h1 className="display-6">Sign up</h1>
          {errors.unknown && (
            <Alert variant="danger">An unknown error has occured. Please try again later.</Alert>
          )}
        </div>

        <Form onSubmit={handleSubmit(onSubmit)} noValidate={true}>

          <Form.Group>
            <Form.Label>Email</Form.Label>
            <Form.Control name="email" type="email" placeholder="Email" autoFocus={true}
              maxLength={255}
              isInvalid={errors.email}
              ref={register({
                required: true,
                minLength: 5,
                maxLength: 255,
                validate: isEmail
              })} />
            <Form.Control.Feedback type="invalid">
              {errors.email?.message ? errors.email.message : 'Please enter a valid email address.'}
            </Form.Control.Feedback>
          </Form.Group>

          <Form.Group>
            <Form.Label>Password</Form.Label>
            <Form.Control name="password" type="password" placeholder="Password"
              maxLength={255}
              isInvalid={errors.password}
              ref={register({
                required: 'Please enter a password.',
                minLength: {
                  value: 8,
                  message: 'Password must be at least 8 characters in length.'
                },
                maxLength: 255
              })} />
            <Form.Control.Feedback type="invalid">
              {errors.password?.message ? errors.password.message : 'Invalid password.'}
            </Form.Control.Feedback>
          </Form.Group>

          <Form.Group>
            <Form.Label>Confirm password</Form.Label>
            <Form.Control name="confirmPassword" type="password" placeholder="Confirm password"
              maxLength={255}
              isInvalid={errors.confirmPassword}
              ref={register({
                required: 'Please confirm password.',
                validate: (data) => data === watch('password')
              })} />
            <Form.Control.Feedback type="invalid">
              {errors.confirmPassword?.message ? errors.confirmPassword.message : 'Passwords do not match.'}
            </Form.Control.Feedback>
          </Form.Group>

          <LoadingButton loading={loading}>Create account</LoadingButton>

          <div className="mt-4 text-center">
            <p className="m-0">
              Already have an account?
            </p>
            <p>
              <Link href="/account/login">
                <a className="font-weight-bold">Login</a>
              </Link>
            </p>
          </div>
        </Form>
      </Card>
    </Container>
  );
}
