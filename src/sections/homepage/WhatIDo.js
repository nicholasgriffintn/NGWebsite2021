import styles from '../../styles/Home.module.css';
import { Element } from 'react-scroll';

import GithubWidget from '../../widgets/Github';

const WhatIDo = ({}) => {
  return (
    <section className={styles.wrap}>
      <Element name="whatIDo" id="whatIDo" className={styles.container}>
        <div style={{ textAlign: 'center' }}>
          <h2>So what is it that you do? 🤔</h2>
          <small>
            I'm not sure that I actually know but here's some of my public
            Github stuff:
          </small>
        </div>
        <div
          style={{
            display: 'inline-block',
            width: '100%',
            height: '20px',
          }}
        ></div>
        <GithubWidget />
      </Element>
    </section>
  );
};

export default WhatIDo;
