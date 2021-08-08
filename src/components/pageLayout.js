import styles from '../styles/Page.module.css';
import Link from 'next/link';

import { Element, animateScroll as scroll } from 'react-scroll';

export default function PageLayout({
  children,
  displayHeader = true,
  displayFooter = true,
  showHero = true,
  darkMain = false,
  loadingState = false,
  hideContent = false,
  title = 'NULL',
  description,
  thumbnail,
  header,
  tags,
  ctime,
  comments,
}) {
  return (
    <div className={styles.applayout}>
      {displayHeader === true ? (
        <header className={styles.header}>
          <nav className={styles.nav}>
            <Link href="/">
              <a className={styles.logo}>Nicholas Griffin</a>
            </Link>
          </nav>
        </header>
      ) : null}
      {showHero === true ? (
        <section
          className={styles.hero}
          style={loadingState === true ? { minHeight: '100vh' } : null}
        >
          <div className={styles.heroPara}>
            <div className={styles.heroBgWrap}>
              <div
                style={header ? { backgroundImage: `url(${header})` } : null}
                className={styles.heroBg}
              ></div>
            </div>
            {hideContent === true ? null : (
              <div
                style={header ? { position: 'relative', zIndex: '9' } : null}
                className={styles.heroContent}
              >
                <div className={styles.container}>
                  <div className={styles.heroContentTitle}>
                    <h1>{title}</h1>
                    {description ? <p>{description}</p> : null}
                  </div>
                </div>
              </div>
            )}
          </div>
        </section>
      ) : null}
      <main
        className={styles.main}
        style={
          loadingState === true
            ? { display: 'none' }
            : showHero === false && darkMain === true
            ? { minHeight: '100vh!important', background: '#222!important' }
            : showHero === false
            ? { minHeight: '100vh!important' }
            : null
        }
      >
        <section className={styles.wrap}>
          <Element
            name="pageContent"
            id="pageContent"
            className={styles.container}
          >
            {children}
          </Element>
        </section>
      </main>
      {displayFooter === true ? (
        <footer>
          <div className="footer-wrap">
            <div className="container-main">
              <span className="footer-text-left">No copyright required.</span>
              <span className="footer-text-right">
                Check out the source code for this site one{' '}
                <a
                  href="https://github.com/nicholasgriffintn/NGWebsite2020"
                  title="Github Source Code"
                  target="_blank"
                >
                  Github
                </a>
                . And the{' '}
                <a
                  href="https://nicholasgriffin.dev/api/graphql"
                  title="Personal Site GraphQL Playground"
                  target="_blank"
                >
                  GraphQL API here
                </a>
              </span>
            </div>
          </div>
        </footer>
      ) : null}
    </div>
  );
}
