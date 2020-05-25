import React from 'react';
import Container from 'react-bootstrap/Container';

interface Props {
  children: React.ReactNode;
  className?: string;
}

export default function AccountContainer({ children, className = '' }: Props): JSX.Element {
  return (
    <Container className={`ml-auto mr-auto mt-5 ${className}`} style={{ maxWidth: '420px' }}>
      {children}
    </Container>
  );
}
