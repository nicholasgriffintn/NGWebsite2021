import styles from '../styles/Page.module.css';

import PageLayout from '../components/pageLayout';

export default function Page() {
  return (
    <PageLayout
      title="Thank you for sending your message"
      hideContent={true}
      showHero={false}
      loadingState={false}
      darkMain={false}
    >
      <div>
        <div className={styles['flex-grid']}>
          <div className={styles.col} style={{ width: '66.66%' }}>
            <h1>Thank you for sending your message</h1>
            <p>I'll get back to you soon if what you sent requires a reply.</p>
          </div>
        </div>
      </div>
    </PageLayout>
  );
}
