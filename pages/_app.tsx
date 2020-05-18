import React from 'react';
import Head from 'next/head';
import Layout from '../components/layout';
import '../sass/main.scss'

export default function MyApp({ Component, pageProps }) {
  return (
    <Layout>
      <Head>
        <title>Starter</title>
      </Head>
      <Component {...pageProps} />
    </Layout>
  );
}
