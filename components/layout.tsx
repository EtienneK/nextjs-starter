import Footer from './footer';
import Header from './header';
import Meta from './meta';

export default function Layout({ children }) {
  return (
    <>
      <Meta />
      <Header />
      <main>{children}</main>
      <Footer />
    </>
  );
}
