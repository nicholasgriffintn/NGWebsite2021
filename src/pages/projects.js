import { useState, useEffect } from 'react';
import styles from '../styles/Page.module.css';
import PageLayout from '../components/pageLayout';
import Link from 'next/link';
import { useAppContext } from '../context/store';

import GithubWidget from '../widgets/Github';

export default function Page() {
  const { github, githubLoading, fetchGithub } = useAppContext();

  useEffect(() => {
    fetchGithub(100);
  }, []);

  return (
    <PageLayout
      title="Projects"
      hideContent={true}
      showHero={false}
      loadingState={false}
      darkMain={false}
    >
      <div className="standard-page-content">
        <div className={styles['flex-grid']}>
          <div
            className={styles.col}
            style={{ maxWidth: '980px', width: '100%', margin: '0 auto' }}
          >
            <h1>Projects</h1>
            <p>
              It&apos;s my aim to spend a big percentage of my personal time on
              a number of projects.
            </p>
            <p>
              I often work on quite a few different things that you might find
              interesting, take a look at some of them below.
            </p>
            <p>
              You can also take a look at my{' '}
              <Link href="/snippets">
                <a>code snippets</a>
              </Link>{' '}
              for some of my quick fixes and tips.
            </p>
            <GithubWidget loading={githubLoading} github={github} />
          </div>
        </div>
      </div>
    </PageLayout>
  );
}
