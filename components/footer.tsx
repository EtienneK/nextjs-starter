import React from 'react';
import Container from 'react-bootstrap/Container';

export default function Footer(): JSX.Element {
  return (
    <footer>
      <Container className="text-center">
        <p className="float-left">&copy; 2020 Company, Inc. All Rights Reserved.</p>
      </Container>
    </footer>
  );
}
