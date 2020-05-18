import Container from 'react-bootstrap/Container';
import Nav from 'react-bootstrap/Nav';
import Navbar from 'react-bootstrap/Navbar';

export default function Header() {
  return (
    <Navbar bg="light" expand="lg" fixed="top" className="border-bottom">
      <Container>
        <Navbar.Brand href="#home">Next.js Starter</Navbar.Brand>
        <Navbar.Toggle />
        <Navbar.Collapse>
          <Nav>
            <Nav.Item>
              <Nav.Link href="/" active={true}>Home</Nav.Link>
            </Nav.Item>
          </Nav>
          <Nav className='ml-auto'>
            <Nav.Item>
              <Nav.Link href="#">Login</Nav.Link>
            </Nav.Item>
            <Nav.Item>
              <Nav.Link href="#">Sign up</Nav.Link>
            </Nav.Item>
          </Nav>
        </Navbar.Collapse>
      </Container>
    </Navbar>
  );
}
