import { useState, useEffect } from 'react';

import styles from '../../styles/Page.module.css';

import PageLayout from '../../components/pageLayout';

import Gists from '../../widgets/Gists';

export default function Page() {
  const [gists, setGists] = useState([]);

  const fetchSnippets = async function fetchSnippets(loadMore) {
    fetch('/api/gists')
      .then((data) => {
        return data.json();
      })
      .then((data) => {
        setGists(data);
      })
      .catch((err) => {
        console.error(err);
      });
  };

  useEffect(() => {
    fetchSnippets();
  }, []);

  return (
    <PageLayout
      title="Code Snippets"
      hideContent={true}
      showHero={false}
      loadingState={false}
      darkMain={false}
    >
      <div>
        <div className={styles['flex-grid']}>
          <div className={styles.col} style={{ width: '66.66%' }}>
            <h1>Code Snippets</h1>
            <p>
              These are some random code snippets that I have made available on
              Github&apos;s Gists platform. You&apos;ll find a range of things
              here from the day to day bug fix up to something that might be a
              little more useful.
            </p>
            <Gists gists={gists} />
          </div>
        </div>
      </div>
    </PageLayout>
  );
}
