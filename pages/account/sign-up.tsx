import Link from 'next/link';

import Button from 'react-bootstrap/Button';
import Card from 'react-bootstrap/Card';
import Container from 'react-bootstrap/Container';
import Form from 'react-bootstrap/Form';

export default function SignUp() {
  return (
    <Container className="ml-auto mr-auto mt-4" style={{ maxWidth: '360px' }}>
      <Card className="bg-light p-4">
        <div className="text-center">
          <h1 className="display-6">Sign up</h1>
        </div>
        <Form>

          <Form.Group>
            <Form.Label>Email</Form.Label>
            <Form.Control type="email" placeholder="Email" autoFocus={true} />
          </Form.Group>

          <Form.Group>
            <Form.Label>Password</Form.Label>
            <Form.Control type="password" placeholder="Password" />
          </Form.Group>

          <Form.Group>
            <Form.Label>Confirm password</Form.Label>
            <Form.Control type="password" placeholder="Confirm password" />
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
