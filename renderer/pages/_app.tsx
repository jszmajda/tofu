import React from 'react'
import type { AppProps } from 'next/app'

import '../styles/globals.css'

function MyApp({ Component, pageProps }: AppProps) {
  return (
    <html data-theme="garden">
      <Component {...pageProps} />
    </html>
  );
}

export default MyApp
