import styles from '../styles/Home.module.css';
import API from '@aws-amplify/api';
import { sortedPosts } from '../graphql/queries';
import { useState, useEffect } from 'react';
import { NextSeo } from 'next-seo';

import Header from '../components/Header';
import Footer from '../components/Footer';

import Hero from '../sections/homepage/Hero';
import OpeningContent from '../sections/homepage/OpeningContent';
import Blog from '../sections/homepage/Blog';
import BlogPosts from '../sections/homepage/BlogPosts';
import WhatIDo from '../sections/homepage/WhatIDo';
import Languages from '../sections/homepage/Languages';
import Tools from '../sections/homepage/Tools';

export default function Home() {
  const [spotify, setSpotify] = useState([]);
  const [spotifyLoading, setSpotifyLoading] = useState(true);

  const [github, setGithub] = useState([]);
  const [githubLoading, setGithubLoading] = useState(true);

  const [posts, setPosts] = useState([]);
  const [postsLoading, setPostsLoading] = useState([]);
  const [postsNextToken, setPostsNextToken] = useState(null);
  const [postsStartedAt, setPostsStartedAt] = useState(null);
  const [postsAllowLoadMore, setPostsAllowLoadMore] = useState(false);

  const [hasScrolled, setHasScrolled] = useState(false);

  const fetchPosts = async function fetchPosts(loadMore) {
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
          setPosts([posts, ...postData.data.sortedPosts.items]);
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

  const fetchSpotify = async function fetchSpotify(loadMore) {
    fetch('/api/spotify')
      .then((data) => {
        return data.json();
      })
      .then((data) => {
        setSpotifyLoading(false);
        if (data && data.data && data.data.recenttracks) {
          setSpotify(data.data.recenttracks);
        }
      })
      .catch((err) => {
        setSpotifyLoading(false);
        console.error(err);
      });
  };

  const fetchGithub = async function fetchGithub(loadMore) {
    fetch('/api/github')
      .then((data) => {
        return data.json();
      })
      .then((data) => {
        setGithubLoading(false);
        setGithub(data);
      })
      .catch((err) => {
        setGithubLoading(false);
        console.error(err);
      });
  };

  useEffect(() => {
    // Set has scrolled on scroll
    if (window !== undefined) {
      window.addEventListener('scroll', () => {
        setHasScrolled(true);
      });
    }
  }, []);

  useEffect(() => {
    // Fetch posts on load
    fetchPosts();

    // Fetch spotify on load
    fetchSpotify();

    // Fetch github on load
    fetchGithub();

    // Fetch posts on update
    // DataStore.observe(Post).subscribe(() => fetchPosts());
  }, []);

  return (
    <div className={styles.applayout}>
      <Header />
      <NextSeo title="Homepage" />
      <Hero hasScrolled={hasScrolled} />
      <main className={styles.main}>
        <OpeningContent spotify={spotify} loading={spotifyLoading} />
        <Blog />
        <BlogPosts
          fetchPosts={fetchPosts}
          postsAllowLoadMore={postsAllowLoadMore}
          posts={posts}
          loading={postsLoading}
        />
        <WhatIDo github={github} loading={githubLoading} />
        <Languages />
        <Tools />
      </main>
      <Footer />
    </div>
  );
}
