import styles from '../styles/Page.module.css';
import PageLayout from '../components/pageLayout';
import { useAppContext } from '../context/store';

import BookmarksWidget from '../widgets/Bookmarks';
import BookmarksAdminWidget from '../widgets/BookmarksAdmin';

export default function Page() {
  const { cognitoState } = useAppContext();

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
            {cognitoState === 'loggedIn' ? (
              <div className="admin-block">
                <h2>Bookmarks Admin</h2>
                <BookmarksAdminWidget limit={100} />
                <hr></hr>
              </div>
            ) : null}
            <BookmarksWidget limit={100} />
          </div>
        </div>
      </div>
    </PageLayout>
  );
}
