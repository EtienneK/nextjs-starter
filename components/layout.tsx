import React from 'react';
import Footer from './footer';
import Header from './header';
import Meta from './meta';

interface Props {
  children: React.ReactNode;
}

export default function Layout({ children }: Props): JSX.Element {
  return (
    <>
      <Meta />
      <Header />
      <main>{children}</main>
      <Footer />
    </>
  );
}
