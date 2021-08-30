import { useState, useEffect } from 'react';

import styles from '../../styles/Page.module.css';

import PageLayout from '../../components/pageLayout';

import Gists from '../../widgets/Gists';

import { useAppContext } from '../../context/store';

export default function Page() {
  const { logger } = useAppContext();
  const [gists, setGists] = useState([]);
  const [loading, setLoading] = useState(true);

  const fetchSnippets = async function fetchSnippets(loadMore) {
    fetch('/api/gists')
      .then((data) => {
        return data.json();
      })
      .then((data) => {
        setGists(data);
        setLoading(false);
      })
      .catch((err) => {
        logger.error(err);
        setLoading(false);
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
      <div className="standard-page-content">
        <div className={styles['flex-grid']}>
          <div
            className={styles.col}
            style={{ maxWidth: '980px', width: '100%', margin: '0 auto' }}
          >
            <h1>Code Snippets</h1>
            <p>
              These are some random code snippets that I have made available on
              Github&apos;s Gists platform. You&apos;ll find a range of things
              here from the day to day bug fix up to something that might be a
              little more useful.
            </p>
            <Gists gists={gists} loading={loading} />
          </div>
        </div>
      </div>
    </PageLayout>
  );
}
