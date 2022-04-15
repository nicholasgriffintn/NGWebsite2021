import * as React from 'react';
import { useAppContext } from '../context/store';

const Comments = ({}) => {
  const { darkMode, cookiesAccepted } = useAppContext();

  if (cookiesAccepted === '1') {
    return (
      <section
        className="comments"
        ref={(elem) => {
          if (!elem || elem.childNodes.length) {
            return;
          }
          const scriptElem = document.createElement('script');
          scriptElem.src = 'https://giscus.app/client.js';
          scriptElem.async = true;
          scriptElem.crossOrigin = 'anonymous';
          scriptElem.setAttribute('data-category', 'General');
          scriptElem.setAttribute('data-category-id', 'DIC_kwDOEWdp3s4COmKH');
          scriptElem.setAttribute('data-mapping', 'title');
          scriptElem.setAttribute('data-reactions-enabled', '1');
          scriptElem.setAttribute('data-category', 'General');
          scriptElem.setAttribute('data-emit-metadata', '0');
          scriptElem.setAttribute('data-input-position', 'top');
          scriptElem.setAttribute('data-lang', 'en');
          scriptElem.setAttribute('data-loading', 'lazy');
          scriptElem.setAttribute(
            'data-repo',
            'nicholasgriffintn/nicholasgriffintn'
          );
          scriptElem.setAttribute(
            'data-repo-id',
            'MDEwOlJlcG9zaXRvcnkyOTE5ODk5ODI'
          );
          scriptElem.setAttribute(
            'data-theme',
            darkMode.darkModeActive === true ? 'dark' : 'light'
          );
          elem.appendChild(scriptElem);
        }}
      />
    );
  }

  return (
    <section className="comments">
      <p
        style={{
          textAlign: 'center',
          marginTop: '20px',
          display: 'inline-block',
          width: '100%',
        }}
      >
        You must accept my use of cookies before you can comment or read
        comments! Please refresh this page if you have accepted cookies and this
        still shows.
      </p>
    </section>
  );
};

export default Comments;
