import React from 'react';

import PageLayout from '../components/pageLayout';

const TechNuttyPage = () => (
  <PageLayout
    displayHeader={true}
    showHero={false}
    darkMain={true}
    title="TechNutty"
  >
    <div className="content-wrap landing-content-wrap">
      <div className="container-main">
        <div className="page-header-spacer"></div>

        <h1 id="single-title" className="animated bounceInDown">
          Hey! I see that you have come for my old site TechNutty.
        </h1>
        <p>
          Sorry to say but I decided that I would stop my management of that
          site back in 2018, I am now focusing on web development and other
          interesting projects.
        </p>
        <div className="title-button-wrap">
          <a
            className="button button-prime-inverted"
            href="https://nicholasgriffin.dev"
          >
            Find out more
          </a>
        </div>
      </div>
    </div>
  </PageLayout>
);

export default TechNuttyPage;
