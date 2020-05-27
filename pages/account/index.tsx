import React, { useState, useEffect } from 'react';
import { useForm } from 'react-hook-form';

import Accordion from 'react-bootstrap/Accordion';
import Alert from 'react-bootstrap/Alert';
import Button from 'react-bootstrap/Button';
import Card from 'react-bootstrap/Card';
import Form from 'react-bootstrap/Form';
import Spinner from 'react-bootstrap/Spinner';

import { BsCheckBox } from 'react-icons/bs';

import AccountContainer from '../../components/AccountContainer';
import LoadingButton from '../../components/LoadingButton';
import EmailInput from '../../components/EmailInput';

export default function ForgotPasswordReset(): JSX.Element {
  const [me, setMe] = useState(null);
  const [gettingMe, setGettingMe] = useState(false);
  const [submittingProfile, setSubmittingProfile] = useState(false);

  const [submittingPasswordReset, setSubmittingPasswordReset] = useState(false);
  const [passwordResetSubmitted, setPasswordResetSubmitted] = useState(false);

  useEffect(() => {
    if (gettingMe) return;
    setGettingMe(true);
    fetch('/api/account/me')
      .then((res) => res.json())
      .then(setMe);
  });

  const {
    register, handleSubmit, watch, errors, setError,
  } = useForm();

  const {
    handleSubmit: handlePasswordResetSubmit,
  } = useForm();

  const passwordResetSubmit = async (): Promise<void> => {
    if (submittingPasswordReset) return;
    setSubmittingPasswordReset(true);
    try {
      const res = await fetch('/api/account/reset-password', {
        body: JSON.stringify({ email: me.email }),
        headers: {
          'Content-Type': 'application/json',
        },
        method: 'POST',
      });

      switch (res.status) {
        case 200:
          setSubmittingPasswordReset(false);
          setPasswordResetSubmitted(true);
          break;
        default:
          throw new Error('An unknown error has occured. Please try again later.');
      }
    } catch (err) {
      setError('unknown', 'unknown');
      setSubmittingPasswordReset(false);
    }
  };

  if (!me) {
    return (
      <AccountContainer className="text-center">
        <div className="text-center">
          <h1 className="h3 mb-4">Account</h1>
        </div>
        <Spinner animation="border" />
      </AccountContainer>
    );
  }

  return (
    <AccountContainer>
      <div className="text-center">
        <h1 className="h3 mb-4">Account</h1>
        {errors.unknown && (
          <Alert variant="danger">{errors.unknown.message}</Alert>
        )}
      </div>
      <Accordion defaultActiveKey="0">
        <Card>
          <Card.Header>
            <Accordion.Toggle as={Button} variant="link" eventKey="0">
              Profile
            </Accordion.Toggle>
          </Card.Header>
          <Accordion.Collapse eventKey="0">
            <Card.Body>
              <Form noValidate>
                <EmailInput
                  disabled={submittingProfile}
                  errors={errors}
                  register={register}
                  value={me.email}
                />
                <LoadingButton loading={false}>
                  Save
                </LoadingButton>
              </Form>
            </Card.Body>
          </Accordion.Collapse>
        </Card>
        <Card>
          <Card.Header>
            <Accordion.Toggle as={Button} variant="link" eventKey="1">
              Password
            </Accordion.Toggle>
          </Card.Header>
          <Accordion.Collapse eventKey="1">
            <Card.Body>

              {passwordResetSubmitted
                ? (
                  <>
                    <Alert variant="success">
                      <BsCheckBox />
                      &nbsp;We have sent you an email with password reset instructions.
                    </Alert>
                    <p>
                      Please check your spam folder if you did not receive an email.
                    </p>
                    <p>
                      Otherwise, you will have to wait 30 minutes for your previous password
                      reset request to expire before being able to request another.
                    </p>
                    <Button
                      block
                      size="lg"
                      onClick={(): void => setPasswordResetSubmitted(false)}
                    >
                      OK
                    </Button>
                  </>
                )
                : (
                  <Form
                    noValidate
                    onSubmit={handlePasswordResetSubmit(passwordResetSubmit)}
                  >
                    <LoadingButton loading={submittingPasswordReset}>Reset password</LoadingButton>
                  </Form>
                )}
            </Card.Body>
          </Accordion.Collapse>
        </Card>
        <Card>
          <Card.Header>
            <Accordion.Toggle className="text-danger" as={Button} variant="link" eventKey="2">
              Delete account
            </Accordion.Toggle>
          </Card.Header>
          <Accordion.Collapse eventKey="2">
            <Card.Body>TODO</Card.Body>
          </Accordion.Collapse>
        </Card>
      </Accordion>
    </AccountContainer>
  );
}
