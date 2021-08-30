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
          scriptElem.src = 'https://utteranc.es/client.js';
          scriptElem.async = true;
          scriptElem.crossOrigin = 'anonymous';
          scriptElem.setAttribute('repo', 'nicholasgriffintn/NGWebsite2021');
          scriptElem.setAttribute('issue-term', 'title');
          scriptElem.setAttribute('label', 'comment :speech_balloon:');
          scriptElem.setAttribute(
            'theme',
            darkMode.darkModeActive === true ? 'github-dark' : 'github-light'
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
