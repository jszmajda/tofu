import React from 'react'
import type { AppProps } from 'next/app'
import Layout from '../components/Layout';
import '../styles/globals.css'
import { Provider } from 'jotai';

function MyApp({ Component, pageProps }: AppProps) {

  return (
    <Provider>
      <Layout>
        <Component {...pageProps} />
      </Layout>
    </Provider>
  )
}

export default MyApp
