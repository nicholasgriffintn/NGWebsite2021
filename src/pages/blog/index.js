import styles from '../../styles/Page.module.css';

import PageLayout from '../../components/pageLayout';

export default function Page() {
  return (
    <PageLayout title="My blog posts">
      <div>
        <div className={styles['flex-grid']}>
          <div className={styles.col} style={{ width: '66.66%' }}></div>
        </div>
      </div>
    </PageLayout>
  );
}
