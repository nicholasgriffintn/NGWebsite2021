import '../styles/globals.css';

import Amplify, { AuthModeStrategyType } from 'aws-amplify';
import config from '../aws-exports';

import { DefaultSeo } from 'next-seo';

Amplify.configure({
  ...config,
  DataStore: {
    authModeStrategyType: AuthModeStrategyType.MULTI_AUTH,
  },
  ssr: true,
});

function NGWebsiteApp({ Component, pageProps }) {
  return (
    <>
      <DefaultSeo
        titleTemplate="%s | Nicholas Griffin"
        title="Page"
        openGraph={{
          type: 'website',
          locale: 'en_GB',
          url: 'https://nicholasgriffin.dev/',
          title: 'Nicholas Griffin',
          site_name: 'Nicholas Griffin',
          description: 'Web Developer, Blogger and Technology Enthusiast',
          images: [{ url: '/images/social.jpeg' }],
        }}
        twitter={{
          handle: '@NGriffintn',
          site: '@NGriffintn',
          cardType: 'summary_large_image',
        }}
      />
      <Component {...pageProps} />
    </>
  );
}

export default NGWebsiteApp;
