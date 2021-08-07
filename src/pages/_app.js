import '../styles/globals.css';

import Amplify, { AuthModeStrategyType } from 'aws-amplify';
import config from '../aws-exports';

Amplify.configure({
  ...config,
  DataStore: {
    authModeStrategyType: AuthModeStrategyType.MULTI_AUTH,
  },
  ssr: true,
});

function NGWebsiteApp({ Component, pageProps }) {
  return <Component {...pageProps} />;
}

export default NGWebsiteApp;
