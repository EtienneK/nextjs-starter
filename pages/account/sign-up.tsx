import Link from 'next/link';

import Button from 'react-bootstrap/Button';
import Card from 'react-bootstrap/Card';
import Container from 'react-bootstrap/Container';
import Form from 'react-bootstrap/Form';

import { useForm } from 'react-hook-form';

export default function SignUp() {
  const { register, handleSubmit, watch, errors, setError } = useForm();
  const onSubmit = data => {
    setError('email', 'validate', 'something');
    console.log(data);
  };

  return (
    <Container className="ml-auto mr-auto mt-4" style={{ maxWidth: '360px' }}>
      <Card className="bg-light p-4">
        <div className="text-center">
          <h1 className="display-6">Sign up</h1>
        </div>
        <Form onSubmit={handleSubmit(onSubmit)}>

          <Form.Group>
            <Form.Label>Email</Form.Label>
            <Form.Control isInvalid={errors.email} name="email" type="email" placeholder="Email" autoFocus={true}
              ref={register({ required: true })} />
            <Form.Control.Feedback type="invalid">
              {errors.email?.message ? errors.email.message : "Please enter a valid email address."}
            </Form.Control.Feedback>
          </Form.Group>

          <Form.Group>
            <Form.Label>Password</Form.Label>
            <Form.Control name="password" type="password" placeholder="Password"
              ref={register({ required: true })} />
          </Form.Group>

          <Form.Group>
            <Form.Label>Confirm password</Form.Label>
            <Form.Control name="confirmPassword" type="password" placeholder="Confirm password"
              ref={register({ required: true })} />
          </Form.Group>

          <Button variant="primary" size="lg" block={true} className="mt-4" type="submit">
            Create account
          </Button>

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
