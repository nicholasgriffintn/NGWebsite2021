import { useState, useEffect } from 'react';
import { createContext, useContext } from 'react';
import API from '@aws-amplify/api';
import { sortedPosts } from '../graphql/queries';
import { Logger } from '@aws-amplify/core';
import { useDarkMode } from 'next-dark-mode';

const AppContext = createContext();
const logger = new Logger('NGWebsiteApp');

export function AppWrapper({ children }) {
  const [cognitoState, setCognitoState] = useState('init');

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

  const [spotify, setSpotify] = useState([]);
  const [spotifyLoading, setSpotifyLoading] = useState(true);

  const [github, setGithub] = useState([]);
  const [githubLoading, setGithubLoading] = useState(true);

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

  const fetchSpotify = async function fetchSpotify() {
    setSpotifyLoading(true);
    setSpotify({});

    fetch(`/api/spotify`)
      .then((data) => {
        return data.json();
      })
      .then((data) => {
        setSpotifyLoading(false);
        if (data && data.recenttracks) {
          setSpotify(data.recenttracks);
        }
      })
      .catch((err) => {
        setSpotifyLoading(false);
        logger.error(err);
      });
  };

  const fetchGithub = async function fetchGithub(limit) {
    setGithubLoading(true);
    setGithub({});

    fetch(`/api/github${limit ? `?limit=${limit}` : ''}`)
      .then((data) => {
        return data.json();
      })
      .then((data) => {
        setGithubLoading(false);
        setGithub(data);
      })
      .catch((err) => {
        setGithubLoading(false);
        logger.error(err);
      });
  };

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
    logger,
    darkMode,
    cognitoState,
    setCognitoState,
    spotify,
    setSpotify,
    spotifyLoading,
    setSpotifyLoading,
    fetchSpotify,
    github,
    setGithub,
    githubLoading,
    setGithubLoading,
    fetchGithub,
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
