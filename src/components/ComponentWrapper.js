import { useAppContext } from '../context/store';
// import * as Sentry from '@sentry/nextjs';
import config from '../config';
import { useRouter } from 'next/router';
import posthog from 'posthog-js';
import { useEffect } from 'react';

const ComponentWrapper = ({ children }) => {
  const { cookiesAccepted } = useAppContext();

  const router = useRouter();

  useEffect(() => {
    if (cookiesAccepted === '1') {
      // Init Sentry
      /* const SENTRY_DSN =
        process.env.SENTRY_DSN || process.env.NEXT_PUBLIC_SENTRY_DSN;

      Sentry.init({
        dsn: SENTRY_DSN || config.sentry_dsn,
        tracesSampleRate: 1.0,
      }); */

      // Init PostHog
      posthog.init(config.posthog_key, { api_host: 'https://app.posthog.com' });

      // Track page views
      const handleRouteChange = () => posthog.capture('$pageview');
      router.events.on('routeChangeComplete', handleRouteChange);

      return () => {
        router.events.off('routeChangeComplete', handleRouteChange);
      };
    }
  }, [router.events]);

  return <>{children}</>;
};

export default ComponentWrapper;
