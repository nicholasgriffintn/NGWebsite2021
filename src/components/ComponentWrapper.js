import Head from 'next/head';
import { useAppContext } from '../context/store';

const ComponentWrapper = ({ children }) => {
  const { cookiesAccepted } = useAppContext();

  return (
    <>
      <Head>
        {typeof window !== undefined && cookiesAccepted === "1" && (
          <script
            id="analytics-script"
            defer
            data-domain="nicholasgriffin.dev"
            src="https://plausible.io/js/script.js"
          ></script>
        )}
      </Head>
      {children}
    </>
  );
};

export default ComponentWrapper;
