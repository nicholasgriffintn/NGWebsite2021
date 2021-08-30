import styles from '../styles/Home.module.css';
import { useEffect } from 'react';
import { NextSeo } from 'next-seo';
import { useAppContext } from '../context/store';

import Header from '../components/Header';
import Footer from '../components/footer';

import Hero from '../sections/homepage/Hero';
import OpeningContent from '../sections/homepage/OpeningContent';
import Blog from '../sections/homepage/Blog';
import BlogPosts from '../sections/homepage/BlogPosts';
import WhatIDo from '../sections/homepage/WhatIDo';
import Languages from '../sections/homepage/Languages';
import Tools from '../sections/homepage/Tools';

export default function Home() {
  const {
    darkMode,
    fetchSpotify,
    github,
    githubLoading,
    fetchGithub,
    fetchPosts,
  } = useAppContext();

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
    <div
      className={
        darkMode.darkModeActive === true || darkMode.darkModeActive === 'true'
          ? styles.appLayoutDark
          : styles.appLayout
      }
    >
      <Header />
      <NextSeo title="Homepage" />
      <Hero />
      <main className={styles.main}>
        <OpeningContent />
        <Blog />
        <BlogPosts />
        <WhatIDo github={github} loading={githubLoading} />
        <Languages />
        <Tools />
      </main>
      <Footer />
    </div>
  );
}
