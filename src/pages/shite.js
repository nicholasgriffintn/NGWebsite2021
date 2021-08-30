import React from 'react';

import PageLayout from '../components/pageLayout';

const ShitePage = () => (
  <PageLayout
    displayHeader={true}
    showHero={false}
    darkMain={true}
    title="This is a shite page"
  >
    <div className="content-wrap landing-content-wrap">
      <div className="container-main">
        <div className="page-header-spacer"></div>

        <h1 id="single-title" className="animated bounceInDown">
          <span className="emoji">💩</span>I don&apos;t really know what to do
          with this domain...
        </h1>
        <div className="title-button-wrap">
          <a
            className="button button-prime-inverted"
            href="https://nicholasgriffin.dev"
          >
            Check out my homepage instead?
          </a>
        </div>
      </div>
    </div>
  </PageLayout>
);

export default ShitePage;
