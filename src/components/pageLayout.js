import styles from '../styles/Page.module.css';
import Link from 'next/link';

import { Element, animateScroll as scroll } from 'react-scroll';

export default function PageLayout({
  children,
  displayHeader = true,
  displayFooter = true,
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
      <section className={styles.hero}>
        <div className={styles.heroPara}>
          <div className={styles.heroBgWrap}>
            <div className={styles.heroBg}></div>
          </div>
          <div className={styles.heroContent}>
            <div className={styles.container}>
              <div className={styles.heroContentTitle}>
                <h1>{title}</h1>
                {description ? <p>{description}</p> : null}
              </div>
            </div>
          </div>
        </div>
      </section>
      <main className={styles.main}>
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
          <div class="footer-wrap">
            <div class="container-main">
              <span class="footer-text-left">No copyright required.</span>
              <span class="footer-text-right">
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
