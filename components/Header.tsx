import React from 'react';
import getConfig from 'next/config';
import Link from 'next/link';
import { useRouter } from 'next/router';
import {
  BsArrowBarRight, BsHouse, BsPersonSquare, BsPersonPlus, BsLightning,
} from 'react-icons/bs';
import { FiLogIn, FiLogOut } from 'react-icons/fi';
import Container from 'react-bootstrap/Container';
import Nav from 'react-bootstrap/Nav';
import Navbar from 'react-bootstrap/Navbar';
import Spinner from 'react-bootstrap/Spinner';
import useIsAuthenticated from '../hooks/useIsAuthenticated';

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
  const { publicRuntimeConfig: { appName } } = getConfig();
  const { data, mutate } = useIsAuthenticated();

  const router = useRouter();

  const logout = async (): Promise<void> => {
    await fetch('/api/account/login', {
      method: 'DELETE',
    });
    mutate(false);
    router.replace('/');
  };

  const IsAuthenticatedStillLoading = (
    <Nav className="ml-auto">
      <Nav.Item>
        <Nav.Link><Spinner animation="border" size="sm" /></Nav.Link>
      </Nav.Item>
    </Nav>
  );

  const IsAuthenticatedLoaded = (data && data.isAuthenticated ? (
    <Nav className="ml-auto">
      <NavItemLink href="/account">
        <BsPersonSquare />
        &nbsp;Account
      </NavItemLink>
      <Nav.Item>
        <Nav.Link onClick={logout}>
          <FiLogOut />
          &nbsp;Logout
        </Nav.Link>
      </Nav.Item>
    </Nav>
  ) : (
    <Nav className="ml-auto">
      <NavItemLink href="/account/login">
        <FiLogIn />
        &nbsp;Login
      </NavItemLink>
      <NavItemLink href="/account/register">
        <BsPersonPlus />
        &nbsp;Sign Up
      </NavItemLink>
    </Nav>
  ));

  return (
    <Navbar bg="light" expand="lg" collapseOnSelect>
      <Container>
        <Link href="/" passHref>
          <Nav.Link>
            <Navbar.Brand className="font-weight-bold">
              <BsLightning />
              &nbsp;
              {appName}
            </Navbar.Brand>
          </Nav.Link>
        </Link>
        <Navbar.Toggle />
        <Navbar.Collapse>
          <Nav>
            <NavItemLink href="/" exact>
              <BsHouse />
              &nbsp;Home
            </NavItemLink>
            <NavItemLink href="/proxy-example">
              <BsArrowBarRight />
              &nbsp;Proxy Example
            </NavItemLink>
          </Nav>
          {data ? IsAuthenticatedLoaded : IsAuthenticatedStillLoading}
        </Navbar.Collapse>
      </Container>
    </Navbar>
  );
}
