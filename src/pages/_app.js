import { DefaultSeo } from 'next-seo';
import withDarkMode from 'next-dark-mode';
import { QueryClient, QueryClientProvider } from 'react-query';

import { AppWrapper } from '../context/store';
import CognitoWrapper from '../components/CognitoWrapper';
import CookieMessageWrapper from '../components/CookieMessageWrapper';
import ComponentWrapper from '../components/ComponentWrapper';

import '../styles/globals.css';

const queryClient = new QueryClient();

function NGWebsiteApp({ Component, pageProps }) {
  return (
    <QueryClientProvider client={queryClient}>
      <AppWrapper>
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
        <CognitoWrapper>
          <CookieMessageWrapper>
            <ComponentWrapper>
              <Component {...pageProps} />
            </ComponentWrapper>
          </CookieMessageWrapper>
        </CognitoWrapper>
      </AppWrapper>
    </QueryClientProvider>
  );
}

export default withDarkMode(NGWebsiteApp);
