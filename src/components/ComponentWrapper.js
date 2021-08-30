import { useAppContext } from '../context/store';
import * as Sentry from '@sentry/nextjs';

const ComponentWrapper = ({ children }) => {
  const { cookiesAccepted } = useAppContext();

  if (cookiesAccepted === '1') {
    const SENTRY_DSN =
      process.env.SENTRY_DSN || process.env.NEXT_PUBLIC_SENTRY_DSN;

    Sentry.init({
      dsn:
        SENTRY_DSN ||
        'https://3f628f47345d4f5e8c87f90d842b8c36@o981760.ingest.sentry.io/5936226',
      tracesSampleRate: 1.0,
    });
  }

  return <>{children}</>;
};

export default ComponentWrapper;
