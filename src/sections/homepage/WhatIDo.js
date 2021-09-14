import styles from '../../styles/Home.module.css';
import { Element } from 'react-scroll';

import GithubWidget from '../../widgets/Github';
import Projects from './Projects';

const WhatIDo = ({}) => {
  return (
    <section className={styles.wrap}>
      <Element name="whatIDo" id="whatIDo" className={styles.container}>
        <div style={{ textAlign: 'center' }}>
          <h2>So what is it that you do? 🤔</h2>
          <p>
            I do a whole range of things across the web from blogging on this
            site to random GitHub projects, as a full-time Senior Software
            Engineer, there&apos;s not a whole ton of projects that I can share
            here as the majority of what I work on daily is private.
          </p>
          <p>
            That all said, here are my most recent projects across the web and
            on GitHub:
          </p>
        </div>
        <div
          style={{
            display: 'inline-block',
            width: '100%',
            height: '20px',
          }}
        ></div>
        <GithubWidget limit={4} widKey="hp_github_1" />
        <div
          style={{
            marginLeft: '-15px',
            marginRight: '-15px',
          }}
        >
          <Projects />
        </div>
        <GithubWidget limit={4} offset={2} widKey="hp_github_2" />
      </Element>
    </section>
  );
};

export default WhatIDo;
