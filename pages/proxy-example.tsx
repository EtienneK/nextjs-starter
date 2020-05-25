import React from 'react';
import Container from 'react-bootstrap/Container';
import useSwr from 'swr';
import Spinner from 'react-bootstrap/Spinner';

export default function ProxyExample(): JSX.Element {
  const { data } = useSwr('/api/proxy-example', (url: string) => fetch(url).then((res) => res.json()));
  return (
    <Container className="mt-4">
      <h1>Reply from /api/proxy-example</h1>
      <p>
        (Proxies calls to&nbsp;
        <a href="https://httpbin.org/headers">https://httpbin.org/headers</a>
        )
      </p>
      <pre className="card p-4 bg-light">
        {!data ? (
          <>
            <Spinner animation="border" />
          </>
        ) : JSON.stringify(data, null, 2)}
      </pre>
    </Container>
  );
}
