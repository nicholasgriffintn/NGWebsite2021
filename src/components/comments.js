import * as React from 'react';
import { useAppContext } from '../context/store';

const Comments = ({}) => {
  const { darkMode } = useAppContext();

  return (
    <section
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
};

export default Comments;
