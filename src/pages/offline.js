import React from 'react';

import PageLayout from '../components/pageLayout';

const OfflinePage = () => (
  <PageLayout
    displayHeader={true}
    showHero={false}
    darkMain={true}
    title="Offline"
  >
    <div className="content-wrap landing-content-wrap">
      <div className="container-main">
        <div className="page-header-spacer"></div>

        <h1 id="single-title" className="animated bounceInDown">
          You are offline right now
        </h1>
        <h2>
          If you saved this page then you&apos;d be able read it right now.
        </h2>
        <p>Sadly, you didn&apos;t do that. Maybe next time?</p>
        <div className="title-button-wrap">
          <a
            className="button button-prime-inverted"
            href="https://nicholasgriffin.dev"
          >
            Go back home
          </a>
        </div>
      </div>
    </div>
  </PageLayout>
);

export default OfflinePage;
