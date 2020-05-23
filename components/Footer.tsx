import React from 'react';
import Container from 'react-bootstrap/Container';

export default function Footer(): JSX.Element {
  return (
    <footer>
      <Container className="text-center">
        <p className="float-left">&copy; 2020 Company, Inc. All Rights Reserved.</p>
        <ul className="float-right list-inline">
          <li className="list-inline-item">
            <a href="https://github.com/EtienneK/nextjs-starter">GitHub Project</a>
          </li>
          <li className="list-inline-item">
            <a href="https://github.com/EtienneK/nextjs-starter/issues">Issues</a>
          </li>
        </ul>
      </Container>
    </footer>
  );
}
