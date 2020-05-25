import React, { useState, useEffect } from 'react';
import { useForm } from 'react-hook-form';

import Accordion from 'react-bootstrap/Accordion';
import Button from 'react-bootstrap/Button';
import Card from 'react-bootstrap/Card';
import Form from 'react-bootstrap/Form';
import Image from 'react-bootstrap/Image';
import Spinner from 'react-bootstrap/Spinner';

import AccountContainer from '../../components/AccountContainer';
import LoadingButton from '../../components/LoadingButton';
import EmailInput from '../../components/EmailInput';

export default function ForgotPasswordReset(): JSX.Element {
  const [me, setMe] = useState(null);
  const [gettingMe, setGettingMe] = useState(false);
  const [submittingProfile, setSubmittingProfile] = useState(false);

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

  if (!me) {
    return (
      <AccountContainer className="text-center">
        <Spinner animation="border" />
      </AccountContainer>
    );
  }

  return (
    <AccountContainer>
      <div className="text-center">
        <h1 className="h3 mb-4">Account</h1>
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
              <div className="text-center">
                <Image className="mb-4" src={me.avatar.med} width={72} height={72} />
              </div>
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
            <Card.Body>TODO</Card.Body>
          </Accordion.Collapse>
        </Card>
        <Card>
          <Card.Header>
            <Accordion.Toggle as={Button} variant="link" eventKey="2">
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
