import Document, { Html, Head, Main, NextScript } from 'next/document';

class MyDocument extends Document {
  static async getInitialProps(ctx) {
    const initialProps = await Document.getInitialProps(ctx);
    return { ...initialProps };
  }

  render() {
    return (
      <Html lang="en">
        <meta name="application-name" content="Nicholas Griffin" />
        <meta name="apple-mobile-web-app-capable" content="yes" />
        <meta name="apple-mobile-web-app-status-bar-style" content="default" />
        <meta name="apple-mobile-web-app-title" content="Nicholas Griffin" />
        <meta
          name="description"
          content="Software Developer, Blogger and Technology Enthusiast"
        />
        <meta name="format-detection" content="telephone=no" />
        <meta name="mobile-web-app-capable" content="yes" />
        <meta name="msapplication-config" content="/icons/browserconfig.xml" />
        <meta name="msapplication-TileColor" content="#2B5797" />
        <meta name="msapplication-tap-highlight" content="no" />
        <meta name="theme-color" content="#000000" />

        <link rel="apple-touch-icon" href="/icons/touch-icon-iphone.png" />
        <link
          rel="apple-touch-icon"
          sizes="152x152"
          href="/icons/touch-icon-ipad.png"
        />
        <link
          rel="apple-touch-icon"
          sizes="180x180"
          href="/icons/touch-icon-iphone-retina.png"
        />
        <link
          rel="apple-touch-icon"
          sizes="167x167"
          href="/icons/touch-icon-ipad-retina.png"
        />

        <link
          rel="icon"
          type="image/png"
          sizes="32x32"
          href="/icons/favicon-32x32.png"
        />
        <link
          rel="icon"
          type="image/png"
          sizes="16x16"
          href="/icons/favicon-16x16.png"
        />
        <link rel="manifest" href="/manifest.json" />
        <link
          rel="mask-icon"
          href="/icons/safari-pinned-tab.svg"
          color="#5bbad5"
        />
        <link rel="shortcut icon" href="/favicon.ico" />

        <meta name="twitter:card" content="summary" />
        <meta name="twitter:url" content="https://nicholasgriffin.dev" />
        <meta name="twitter:title" content="Nicholas Griffin" />
        <meta
          name="twitter:description"
          content="Software Engineer, Blogger and Technology Enthusiast"
        />
        <meta
          name="twitter:image"
          content="https://images.nicholasgriffin.dev/resize/?image=Screenshot+2020-04-18+at+23.40.18.png"
        />
        <meta name="twitter:creator" content="@NGriffintn" />
        <meta property="og:type" content="website" />
        <meta property="og:title" content="Nicholas Griffin" />
        <meta
          property="og:description"
          content="Software Engineer, Blogger and Technology Enthusiast"
        />
        <meta property="og:site_name" content="Nicholas Griffin" />
        <meta property="og:url" content="https://nicholasgriffin.dev.com" />
        <meta
          property="og:image"
          content="https://images.nicholasgriffin.dev/resize/?image=Screenshot+2020-04-18+at+23.40.18.png"
        />
        <Head />
        <link
          rel="preconnect"
          href="https://cognito-identity.eu-west-1.amazonaws.com"
        ></link>
        <body>
          <script preload="true" src="/scripts/dm-flash.js" />
          <Main />
          <NextScript />
          <div id="modal-root"></div>
        </body>
      </Html>
    );
  }
}

export default MyDocument;
