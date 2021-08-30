import styles from '../styles/Page.module.css';
import Image from 'next/image';
import ReturnImageFormattingUrl from '../utils/returnImageFormattingUrl';
import { Element } from 'react-scroll';
import Header from './Header';
import Footer from './footer';
import { NextSeo } from 'next-seo';
import { useAppContext } from '../context/store';

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
  const { darkMode } = useAppContext();

  return (
    <div
      className={
        darkMode.darkModeActive === true
          ? styles.appLayoutDark
          : styles.appLayout
      }
    >
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
      {displayHeader === true ? <Header darkMode={darkMode} /> : null}
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
                    priority="true"
                    placeholder="blur"
                    blurDataURL={`/_next/image?url=${ReturnImageFormattingUrl(
                      header
                    )}&w=16&q=1`}
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
            ? { minHeight: '100vh!important', background: '#050505!important' }
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
      {displayFooter === true ? <Footer darkMode={darkMode} /> : null}
    </div>
  );
}
