import React from 'react';
import Button from 'react-bootstrap/Button';
import Spinner from 'react-bootstrap/Spinner';

interface Props {
  children: React.ReactNode;
  loading: boolean;
  loadingText?: string;
}

export default function LoadingButton({ children, loading, loadingText = 'Please wait...' }: Props): JSX.Element {
  return (
    <Button variant="primary" size="lg" block type="submit">
      {loading && (<Spinner animation="border" size="sm" />)}
      {loading && ` ${loadingText}`}
      {!loading && (children)}
    </Button>
  );
}
