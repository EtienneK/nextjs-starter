import React from 'react';
import Footer from './Footer';
import Header from './Header';
import Meta from './Meta';

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
