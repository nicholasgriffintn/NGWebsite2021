import styles from '../styles/Page.module.css';
import Link from 'next/link';
import Image from 'next/image';
import ReturnImageFormattingUrl from '../utils/returnImageFormattingUrl';
import { Element } from 'react-scroll';

import { NextSeo } from 'next-seo';

export default function PageLayout({
  children,
  displayHeader = true,
  displayFooter = true,
  showHero = true,
  darkMain = false,
  loadingState = false,
  hideContent = false,
  title = null,
  description = null,
  thumbnail = null,
  header = null,
  tags = null,
  ctime = null,
  comments = null,
  isArticle = false,
  publishedTime = null,
  modifiedTime = null,
}) {
  return (
    <div className={styles.applayout}>
      <NextSeo
        title={title}
        description={description}
        openGraph={{
          type: isArticle === true ? 'article' : 'website',
          locale: 'en_GB',
          url: 'https://nicholasgriffin.dev/',
          title: title,
          site_name: 'Nicholas Griffin',
          description: description,
          images: [{ url: thumbnail }, { url: header }],
          article:
            isArticle === true
              ? {
                  publishedTime,
                  modifiedTime,
                  authors: {
                    first_name: 'Nicholas',
                    last_name: 'Griffin',
                  },
                  tags,
                }
              : null,
        }}
      />
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
              <div className={styles.heroBg}>
                {header ? (
                  <Image
                    alt={title}
                    src={ReturnImageFormattingUrl(header)}
                    layout="fill"
                    objectFit="cover"
                    quality={80}
                  />
                ) : null}
              </div>
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
      {/* {displayFooter === true ? (
        <footer>
          <div className="footer-wrap">
            <div className="container-main">
              <span className="footer-text-left">No copyright required.</span>
              <span className="footer-text-right">
                Check out the source code for this site one{' '}
                <a
                  href="https://github.com/nicholasgriffintn/NGWebsite2021"
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
      ) : null} */}
    </div>
  );
}
