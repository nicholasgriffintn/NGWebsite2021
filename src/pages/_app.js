import { DefaultSeo } from 'next-seo';
import withDarkMode from 'next-dark-mode';

import { AppWrapper } from '../context/store';
import CognitoWrapper from '../components/CognitoWrapper';

import '../styles/globals.css';

function NGWebsiteApp({ Component, pageProps }) {
  return (
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
        <Component {...pageProps} />
      </CognitoWrapper>
    </AppWrapper>
  );
}

export default withDarkMode(NGWebsiteApp);
