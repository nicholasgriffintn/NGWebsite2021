import styles from '../styles/Page.module.css';
import PageLayout from '../components/pageLayout';

import BookmarksWidget from '../widgets/Bookmarks';

export default function Page() {
  return (
    <PageLayout
      title="Bookmarks"
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
            <h1>Bookmarks</h1>
            <BookmarksWidget limit={100} />
          </div>
        </div>
      </div>
    </PageLayout>
  );
}
