import styles from '../styles/Home.module.css';
import { API } from 'aws-amplify';
import { listPosts } from '../graphql/queries';
import { useState, useEffect } from 'react';
import { NextSeo } from 'next-seo';

import Hero from '../sections/homepage/Hero';
import OpeningContent from '../sections/homepage/OpeningContent';
import Blog from '../sections/homepage/Blog';
import BlogPosts from '../sections/homepage/BlogPosts';
import WhatIDo from '../sections/homepage/WhatIDo';
import Languages from '../sections/homepage/Languages';
import Tools from '../sections/homepage/Tools';

export default function Home() {
  const [spotify, setSpotify] = useState([]);

  const [github, setGithub] = useState([]);

  const [posts, setPosts] = useState([]);
  const [postsNextToken, setPostsNextToken] = useState(null);
  const [postsStartedAt, setPostsStartedAt] = useState(null);
  const [postsAllowLoadMore, setPostsAllowLoadMore] = useState(false);

  const [hasScrolled, setHasScrolled] = useState(false);

  const fetchPosts = async function fetchPosts(loadMore) {
    const postData = await API.graphql({
      query: listPosts,
      variables:
        loadMore === true && postsNextToken
          ? {
              limit: 4,
              nextToken: postsNextToken,
            }
          : {
              limit: 10,
            },
      authMode: 'AWS_IAM',
    });

    if (
      postData &&
      postData.data &&
      postData.data.listPosts &&
      postData.data.listPosts.items
    ) {
      if (postData.data.listPosts.items.length > 0) {
        setPostsAllowLoadMore(false);
        if (loadMore === true) {
          setPosts([posts, ...postData.data.listPosts.items]);
        } else {
          setPosts(postData.data.listPosts.items);
        }

        if (postData.data.listPosts.nextToken) {
          setPostsNextToken(postData.data.listPosts.nextToken);
          setPostsAllowLoadMore(true);
        }

        if (postData.data.listPosts.startedAt) {
          setPostsStartedAt(postData.data.listPosts.startedAt);
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
        if (data && data.data && data.data.recenttracks) {
          setSpotify(data.data.recenttracks);
        }
      })
      .catch((err) => {
        console.error(err);
      });
  };

  const fetchGithub = async function fetchGithub(loadMore) {
    fetch('/api/github')
      .then((data) => {
        return data.json();
      })
      .then((data) => {
        setGithub(data);
      })
      .catch((err) => {
        console.error(err);
      });
  };

  useEffect(() => {
    // Set has scrolled on scroll
    if (window !== undefined) {
      window.addEventListener('scroll', (event) => {
        if (!hasScrolled) {
          setHasScrolled(true);
        }
      });
    }

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
      <NextSeo title="Homepage" />
      <Hero hasScrolled={hasScrolled} />
      <main className={styles.main}>
        <OpeningContent spotify={spotify} />
        <Blog />
        <BlogPosts
          fetchPosts={fetchPosts}
          postsAllowLoadMore={postsAllowLoadMore}
          posts={posts}
        />
        <WhatIDo github={github} />
        <Languages />
        <Tools />
      </main>
      {/* <footer>
        <div className="footer-wrap">
          <div className="container-main">
            <span className="footer-text-left">No copyright required.</span>
            <span className="footer-text-right">
              Check out the source code for this site one{' '}
              <a
                href="https://github.com/nicholasgriffintn/NGWebsite2021"
                title="Github Source Code"
                target="_blank"
              >
                Github
              </a>
              . And the{' '}
              <a
                href="https://nicholasgriffin.dev/api/graphql"
                title="Personal Site GraphQL Playground"
                target="_blank"
              >
                GraphQL API here
              </a>
            </span>
          </div>
        </div>
      </footer> */}
    </div>
  );
}
