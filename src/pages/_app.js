import { useState } from 'react';
import Amplify, { AuthModeStrategyType, Hub, Logger } from 'aws-amplify';
import config from '../aws-exports';
import { DefaultSeo } from 'next-seo';

import redirect from '../utils/redirect';

Amplify.configure({
  ...config,
  DataStore: {
    authModeStrategyType: AuthModeStrategyType.MULTI_AUTH,
  },
  ssr: true,
});

import '../styles/globals.css';

const logger = new Logger('NGWebsiteApp');

function NGWebsiteApp({ Component, pageProps }) {
  const [cognitoState, setCognitoState] = useState('init');

  const listener = (data) => {
    setCognitoState(data.payload.event);
    switch (data.payload.event) {
      case 'signIn':
        logger.debug('user signed in');
        redirect(null, '/');
        break;
      case 'signUp':
        logger.debug('user signed up');
        redirect(null, '/');
        break;
      case 'signOut':
        logger.debug('user signed out');
        redirect(null, '/');
        break;
      case 'signIn_failure':
        logger.error('user sign in failed');
        break;
      case 'tokenRefresh':
        logger.debug('token refresh succeeded');
        break;
      case 'tokenRefresh_failure':
        logger.error('token refresh failed');
        break;
      case 'configured':
        logger.debug('the Auth module is configured');
    }
  };

  Hub.listen('auth', listener);

  return (
    <>
      <DefaultSeo
        titleTemplate="%s | Nicholas Griffin"
        title="Page"
        description="Software Engineer, Blogger and Technology Enthusiast"
        openGraph={{
          type: 'website',
          locale: 'en_GB',
          url: 'https://nicholasgriffin.dev/',
          title: 'Nicholas Griffin',
          site_name: 'Nicholas Griffin',
          description: 'Software Engineer, Blogger and Technology Enthusiast',
          images: [{ url: '/images/social.jpeg' }],
        }}
        twitter={{
          handle: '@NGriffintn',
          site: '@NGriffintn',
          cardType: 'summary_large_image',
        }}
      />
      <Component {...pageProps} cognitoState={cognitoState} />
    </>
  );
}

export default NGWebsiteApp;
