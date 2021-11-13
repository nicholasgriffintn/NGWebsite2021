import { useState, useEffect } from 'react';
import styles from '../../styles/Home.module.css';
import Typed from 'react-typed';
import { useAppContext } from '../../context/store';

import { animateScroll as scroll } from 'react-scroll';

const Hero = ({}) => {
  const { hasScrolled } = useAppContext();

  const [showScroller, setShowScroller] = useState(false);
  const [typedInitialComplete, setTypedInitialComplete] = useState(0);
  const [typedStrings, setTypedStrings] = useState([
    "<p>I'm a <strong>Senior Software Engineer</strong>.</p>",
    "<p>I'm a <strong>Blogger</strong>.</p>",
    "<p>I'm a <strong>Technology Ethusiast</strong>.</p>",
    '<p>Okay...</p>',
    "<p>I'm really just a bit of a <strong>Nerd</strong>.</p>",
    "<p>I live in the <strong>UK</strong>.</p><small>I'm currently based in <strong>London</strong>.</p>",
    '<p>I spend most of my time doing new stuff on the <strong>web</strong>.</p>',
    '<p>Mostly <strong>front end</strong>, but I do dabble in a bit of <strong>back end</strong>.</p>',
    '<p>When I run out of stuff on the web, I often end up staying up late during bindge-watching secctions.</p>',
    '<p>My dogs are complete idiots:</p><br><img height="261px" width="348px" src="/uploads/dogs.png" id="hero_dogs_image" alt="My Shih Tzu\'s" />',
    '<p>But probably not as bad as some of my <strong>code</strong>...</p>',
    "<p>We've all been through those days.</p>",
    '<p>My most used language is <strong>JavaScript</strong>.</p>',
    '<p>I work a lot with <strong>Node.JS</strong>, <strong>React</strong> and <strong>Next.js</strong></p><br><p>But also with <strong>Redis</strong>, <strong>Postgres</strong> and various <strong>AWS</strong> services.</p>',
    "<p>And that's about the sum of it.</p><br><p>Feel free to scroll below to find out more about me about maybe read some of my posts.</p>",
  ]);

  useEffect(() => {
    /* TODO: Make all this work again
    if (typedInitialComplete === 1) {
      setTimeout(function () {
        setTypedStrings([
          '<p> </p>',
          '<p>Are you still reading this?</p>',
          '<p>Did you not see the icon?</p>',
          '<p>Seriously... Just scroll your mouse down!</p>',
        ]);
      }, 6000);
    } else if (typedInitialComplete === 2) {
      setTimeout(function () {
        setTypedStrings([
          '<p> </p>',
          '<p>Fine, be like that.</p>',
          "<p>I'll just do it for you.</p>",
        ]);
      }, 3000);
    } else if (typedInitialComplete === 3) {
      setTypedStrings(['<p>...</p>']);
      scroll.scrollTo('openingContent', {
        duration: 1500,
        delay: 100,
        smooth: true,
        offset: 50,
      });
    } else if (typedInitialComplete === 4) {
      setTimeout(function () {
        setTypedStrings([
          '<p>...</p>',
          '<p>Was that so hard?</p>',
          '<p>Oh wait...</p>',
          "<p>You can't see this..</p>",
          "<p>I could put anything here right now and you wouldn't have a clue...</p>",
          '<p>Watermelons!</p>',
          '<p>Blueberries!</p>',
          '<p>Pineapples!</p>',
          "<p>Wasn't that fun?</p>",
          '<p>I should probably revert this just in case you come back..</p>',
          "<p>Right, let's see, what can I put here?...</p>",
          '<p>I know!</p>',
          '<p>Web Developer, Blogger and Technology Enthusiast</p>',
        ]);
      }, 1000);
    } */
  }, [typedInitialComplete]);

  return (
    <section
      className={styles.hero}
      style={
        !hasScrolled && typedInitialComplete === 0
          ? { minHeight: '100vh' }
          : { minHeight: '800px' }
      }
    >
      <div className={styles.heroPara}>
        <div className={styles.heroBgWrap}>
          <div className={styles.heroBg}></div>
        </div>
        <div className={styles.heroBgAniWrap}>
          <div className={styles.stars}></div>
          <div className={styles.stars1}></div>
          <div className={styles.stars2}></div>
        </div>
        <div
          className={styles.heroContent}
          style={
            !hasScrolled && typedInitialComplete === 0
              ? { paddingTop: '250px' }
              : { paddingTop: '100px' }
          }
        >
          <div className={styles.container}>
            <div className={styles.heroContentTitle}>
              <h1>I'm Nicholas Griffin</h1>
            </div>
            <div className="homepage-subtitle">
              <div className={styles.typedWrap}>
                <Typed
                  strings={typedStrings}
                  typeSpeed={10}
                  backSpeed={0}
                  backDelay={1500}
                  startDelay={200}
                  showCursor={false}
                  smartBackspace={true}
                  onComplete={() => {
                    setTypedInitialComplete(typedInitialComplete + 1);
                    setShowScroller(true);
                  }}
                />
              </div>
            </div>
          </div>
        </div>
        {hasScrolled || showScroller ? (
          <div className={styles.heroScroll}>
            <div
              className={styles.heroScrollIcon}
              onClick={() => {
                scroll.scrollTo('openingContent', {
                  duration: 1500,
                  delay: 100,
                  smooth: true,
                  offset: 50,
                });
              }}
            >
              <div className={styles.heroScrollIconMarker}></div>
            </div>
          </div>
        ) : null}
      </div>
    </section>
  );
};

export default Hero;
