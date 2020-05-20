import React from 'react';
import Button from 'react-bootstrap/Button';
import Col from 'react-bootstrap/Col';
import Container from 'react-bootstrap/Container';
import Jumbotron from 'react-bootstrap/Jumbotron';
import Row from 'react-bootstrap/Row';

export default function Home(): JSX.Element {
  return (
    <>
      <Jumbotron>
        <Container>
          <h1 className="display-3">Next.js Starter</h1>
          <p className="lead">A boilerplate for Next.js web applications.</p>
        </Container>
      </Jumbotron>
      <Container className="mt-4">
        <Row>
          <Col md="4">
            <h3>Heading</h3>
            <p>
              Donec id elit non mi porta gravida at eget metus. Fusce dapibus, tellus ac cursus
              commodo, tortor mauris condimentum nibh, ut fermentum massa justo sit amet risus.
              Etiam porta sem malesuada magna mollis euismod. Donec sed odio dui.
            </p>
            <p><Button variant="secondary">View details &raquo;</Button></p>
          </Col>
          <Col md="4">
            <h3>Heading</h3>
            <p>
              Donec id elit non mi porta gravida at eget metus. Fusce dapibus, tellus ac cursus
              commodo, tortor mauris condimentum nibh, ut fermentum massa justo sit amet risus.
              Etiam porta sem malesuada magna mollis euismod. Donec sed odio dui.
            </p>
            <p><Button variant="secondary">View details &raquo;</Button></p>
          </Col>
          <Col md="4">
            <h3>Heading</h3>
            <p>
              Donec id elit non mi porta gravida at eget metus. Fusce dapibus, tellus ac cursus
              commodo, tortor mauris condimentum nibh, ut fermentum massa justo sit amet risus.
              Etiam porta sem malesuada magna mollis euismod. Donec sed odio dui.
            </p>
            <p><Button variant="secondary">View details &raquo;</Button></p>
          </Col>
        </Row>
      </Container>
    </>
  );
}
