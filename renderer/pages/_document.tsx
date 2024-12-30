import Document, { Head, Html, Main, NextScript } from 'next/document';

class MyDocument extends Document {
  render() {
    return (
      <Html data-theme="cupcake">
        <Head>
          <link rel="icon" type="image/svg+xml" href="path/to/favicon.svg"/>
          <meta name="viewport" content="width=device-width, initial-scale=1.0" />
        </Head>
        <body>
          <Main />
          <NextScript />
        </body>
      </Html>
    );
  }
}

export default MyDocument;
