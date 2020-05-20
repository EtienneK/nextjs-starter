import React from 'react';
import { AppProps } from 'next/app';
import Head from 'next/head';
import Layout from '../components/layout';
import '../sass/main.scss';

export default function MyApp({ Component, pageProps }: AppProps): JSX.Element {
  return (
    <Layout>
      <Head>
        <title>Next.js Starter</title>
      </Head>
      {/* eslint-disable-next-line react/jsx-props-no-spreading */}
      <Component {...pageProps} />
    </Layout>
  );
}
