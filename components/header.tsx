import Link from 'next/link';
import { useRouter } from 'next/router';
import React from 'react';
import Container from 'react-bootstrap/Container';
import Nav from 'react-bootstrap/Nav';
import Navbar from 'react-bootstrap/Navbar';

interface NavItemLinkProps {
  children: React.ReactNode;
  href: string;
  exact?: boolean;
}

function NavItemLink({ children, href, exact = false }: NavItemLinkProps): JSX.Element {
  const router = useRouter();
  const active = exact ? router.pathname === href : router.pathname.startsWith(href);
  return (
    <Nav.Item>
      <Link href={href} passHref>
        <Nav.Link active={active}>{children}</Nav.Link>
      </Link>
    </Nav.Item>
  );
}

export default function Header(): JSX.Element {
  return (
    <Navbar bg="light" expand="lg" fixed="top" className="border-bottom" collapseOnSelect>
      <Container>
        <Link href="/" passHref>
          <Navbar.Brand>Next.js Starter</Navbar.Brand>
        </Link>
        <Navbar.Toggle />
        <Navbar.Collapse>
          <Nav>
            <NavItemLink href="/" exact>Home</NavItemLink>
          </Nav>
          <Nav className="ml-auto">
            <NavItemLink href="/account/login">Login</NavItemLink>
            <NavItemLink href="/account/sign-up">Sign Up</NavItemLink>
          </Nav>
        </Navbar.Collapse>
      </Container>
    </Navbar>
  );
}
