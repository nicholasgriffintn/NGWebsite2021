import { useState, useEffect } from 'react';
import { createContext, useContext } from 'react';
import { API } from '@aws-amplify/api';
import { sortedPosts } from '../graphql/queries';
import { Logger } from '@aws-amplify/core';
import { useDarkMode } from 'next-dark-mode';
import useCookie from 'react-use-cookie';
import checkLoggedIn from '../utils/checkLoggedIn';

const AppContext = createContext();
const logger = new Logger('NGWebsiteApp');

export function AppWrapper({ children }) {
  const baseUrl = {
    development: 'http://localhost:3000',
    production: 'https://nicholasgriffin.dev',
  }[process.env.NODE_ENV];

  const [cognitoState, setCognitoState] = useState('init');
  const [alreadyLoggedIn, setAlreadyLoggedIn] = useState(false);

  useEffect(() => {
    checkLoggedIn()
      .then((value) => {
        setAlreadyLoggedIn(value);
      })
      .catch((value) => {
        setAlreadyLoggedIn(value);
      });
  }, []);

  const darkMode = useDarkMode();

  useEffect(() => {
    if (darkMode.darkModeActive === true) {
      document.body.className = 'dark-mode';
    } else {
      document.body.className = 'light-mode';
    }
    return () => {
      document.body.className = 'light-mode';
    };
  }, [darkMode.darkModeActive]);

  const [showCookieMessage, setShowCookieMessage] = useCookie(
    'showCookieMessage',
    'true'
  );
  const [cookiesAccepted, setCookiesAccepted] = useCookie(
    'cookiesAccepted',
    '0'
  );

  const [posts, setPosts] = useState([]);
  const [postsLoading, setPostsLoading] = useState([]);
  const [postsNextToken, setPostsNextToken] = useState(null);
  const [postsStartedAt, setPostsStartedAt] = useState(null);
  const [postsAllowLoadMore, setPostsAllowLoadMore] = useState(false);

  const fetchPosts = async function fetchPosts(loadMore) {
    setPostsLoading(true);
    const postData = await API.graphql({
      query: sortedPosts,
      variables:
        loadMore === true && postsNextToken
          ? {
              status: 'PUBLISHED',
              sortDirection: 'DESC',
              limit: 4,
              nextToken: postsNextToken,
            }
          : {
              status: 'PUBLISHED',
              sortDirection: 'DESC',
              limit: 10,
            },
      authMode: 'AWS_IAM',
    });

    if (
      postData &&
      postData.data &&
      postData.data.sortedPosts &&
      postData.data.sortedPosts.items
    ) {
      setPostsLoading(false);
      if (postData.data.sortedPosts.items.length > 0) {
        setPostsAllowLoadMore(false);
        if (loadMore === true) {
          const oldPosts = posts;
          const newPosts = postData.data.sortedPosts.items;

          setPosts([...oldPosts, ...newPosts]);
        } else {
          setPosts(postData.data.sortedPosts.items);
        }

        if (postData.data.sortedPosts.nextToken) {
          setPostsNextToken(postData.data.sortedPosts.nextToken);
          setPostsAllowLoadMore(true);
        }

        if (postData.data.sortedPosts.startedAt) {
          setPostsStartedAt(postData.data.sortedPosts.startedAt);
        }
      } else {
        setPostsAllowLoadMore(false);
      }
    }
  };

  function fetchSpotify() {
    return fetch(`${baseUrl}/api/spotify`)
      .then((data) => {
        return data.json();
      })
      .then((data) => {
        if (data && data.recenttracks) {
          return data.recenttracks;
        }

        return {};
      })
      .catch((err) => {
        logger.error(err);
        return {};
      });
  }

  function fetchGithub(limit = 4, offset = 1) {
    return fetch(`${baseUrl}/api/github${`?limit=${limit}&offset=${offset}`}`)
      .then((data) => {
        return data.json();
      })
      .then((data) => {
        return data;
      })
      .catch((err) => {
        logger.error(err);
        return {};
      });
  }

  function fetchProjects() {
    return fetch(`${baseUrl}/api/projects`)
      .then((data) => {
        return data.json();
      })
      .then((data) => {
        return data;
      })
      .catch((err) => {
        logger.error(err);
        return {};
      });
  }

  const [hasScrolled, setHasScrolled] = useState(false);

  useEffect(() => {
    // Set has scrolled on scroll
    if (window !== undefined) {
      window.addEventListener('scroll', () => {
        setHasScrolled(true);
      });
    }
  }, []);

  let sharedState = {
    baseUrl,
    logger,
    darkMode,
    cognitoState,
    setCognitoState,
    alreadyLoggedIn,
    showCookieMessage,
    setShowCookieMessage,
    cookiesAccepted,
    setCookiesAccepted,
    fetchSpotify,
    fetchGithub,
    fetchProjects,
    posts,
    setPosts,
    postsLoading,
    setPostsLoading,
    postsNextToken,
    setPostsNextToken,
    postsStartedAt,
    setPostsStartedAt,
    postsAllowLoadMore,
    setPostsAllowLoadMore,
    fetchPosts,
    hasScrolled,
    setHasScrolled,
  };

  return (
    <AppContext.Provider value={sharedState}>{children}</AppContext.Provider>
  );
}

export function useAppContext() {
  return useContext(AppContext);
}
