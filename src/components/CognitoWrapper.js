import Amplify, { Hub, Logger } from '@aws-amplify/core';
import { AuthModeStrategyType } from '@aws-amplify/datastore';
import redirect from '../utils/redirect';
import config from '../config';
import { useAppContext } from '../context/store';

Amplify.configure({
  ...config,
  DataStore: {
    authModeStrategyType: AuthModeStrategyType.MULTI_AUTH,
  },
  ssr: true,
});

const CognitoWrapper = ({ children }) => {
  const { setCognitoState, logger } = useAppContext();

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

  return <>{children}</>;
};

export default CognitoWrapper;
