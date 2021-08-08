import styles from '../styles/Home.module.css';
import { API } from 'aws-amplify';
import { listPosts } from '../graphql/queries';

import { useState, useEffect } from 'react';
import Link from 'next/link';
import dayjs from 'dayjs';

import Typed from 'react-typed';
import { Element, animateScroll as scroll } from 'react-scroll';

export default function Home() {
  const [spotify, setSpotify] = useState([]);

  const [github, setGithub] = useState([]);

  const [posts, setPosts] = useState([]);
  const [postsNextToken, setPostsNextToken] = useState(null);
  const [postsStartedAt, setPostsStartedAt] = useState(null);
  const [postsAllowLoadMore, setPostsAllowLoadMore] = useState(false);

  const [typedStrings, setTypedStrings] = useState([
    "<p>I'm a <strong>Web Developer</strong>.</p>",
    "<p>I'm a <strong>Blogger</strong>.</p>",
    "<p>I'm a <strong>Technology Ethusiast</strong>.</p>",
    '<p>Okay...</p>',
    "<p>I'm realy just a bit of a <strong>Nerd</strong>.</p>",
    "<p>I live in the <strong>UK</strong>.</p><small>I'm currently based in <strong>Leicester</strong>, but I am planning a move to <strong>London</strong> shortly.</small>",
    '<p>I spend most of my time doing new stuff on the <strong>web</strong>.</p>',
    '<p>Mostly <strong>front end</strong>, but I do dabble in a bit of <strong>back end</strong>.</p>',
    '<p>When I run out of stuff on the web, I often end up staying up late with <strong>Netflix</strong>.</p>',
    '<p>My dogs are complete idiots:</p><br><img height="261px" width="348px" src="/uploads/dogs.JPG" id="hero_dogs_image" alt="My Shih Tzu\'s" />',
    '<p>But probably not as bad as some of my <strong>code</strong>...</p>',
    "<p>We've all been through those days.</p>",
    '<p>My most used language is <strong>JavaScript</strong>.</p>',
    '<p>I work a lot with <strong>Node.JS</strong>, <strong>React</strong> and <strong>Next.js</strong></p><br><p>But also with <strong>Redis</strong>, <strong>Postgres</strong> and various <strong>AWS</strong> services.</p>',
    "<p>And that's about the sum of it.</p><br><p>Feel free to scroll below to find out more about me about maybe read some of my posts.</p>",
  ]);
  const [showScroller, setShowScroller] = useState(false);
  const [typedInitialComplete, setTypedInitialComplete] = useState(0);
  const [hasScrolled, setHasScrolled] = useState(false);

  const fetchPosts = async function fetchPosts(loadMore) {
    const postData = await API.graphql({
      query: listPosts,
      variables:
        loadMore === true && postsNextToken
          ? {
              limit: 4,
              nextToken: postsNextToken,
            }
          : {
              limit: 10,
            },
      authMode: 'AWS_IAM',
    });

    if (
      postData &&
      postData.data &&
      postData.data.listPosts &&
      postData.data.listPosts.items
    ) {
      if (postData.data.listPosts.items.length > 0) {
        setPostsAllowLoadMore(false);
        if (loadMore === true) {
          setPosts([posts, ...postData.data.listPosts.items]);
        } else {
          setPosts(postData.data.listPosts.items);
        }

        if (postData.data.listPosts.nextToken) {
          setPostsNextToken(postData.data.listPosts.nextToken);
          setPostsAllowLoadMore(true);
        }

        if (postData.data.listPosts.startedAt) {
          setPostsStartedAt(postData.data.listPosts.startedAt);
        }
      } else {
        setPostsAllowLoadMore(false);
      }
    }
  };

  const fetchSpotify = async function fetchSpotify(loadMore) {
    fetch('/api/spotify')
      .then((data) => {
        return data.json();
      })
      .then((data) => {
        if (data && data.data && data.data.recenttracks) {
          setSpotify(data.data.recenttracks);
        }
      })
      .catch((err) => {
        console.error(err);
      });
  };

  const fetchGithub = async function fetchGithub(loadMore) {
    fetch('/api/github')
      .then((data) => {
        return data.json();
      })
      .then((data) => {
        setGithub(data);
      })
      .catch((err) => {
        console.error(err);
      });
  };

  useEffect(() => {
    // Set has scrolled on scroll
    if (window !== undefined) {
      window.addEventListener('scroll', (event) => {
        if (!hasScrolled) {
          setHasScrolled(true);
        }
      });
    }

    // Fetch posts on load
    fetchPosts();

    // Fetch spotify on load
    fetchSpotify();

    // Fetch github on load
    fetchGithub();

    // Fetch posts on update
    // DataStore.observe(Post).subscribe(() => fetchPosts());
  }, []);

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
    <div className={styles.applayout}>
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
      <main className={styles.main}>
        <section className={styles.wrap}>
          <Element
            name="openingContent"
            id="openingContent"
            className={styles.container}
          >
            <div>
              <div className="row">
                <div
                  id="openingWelcomeContent"
                  className="col-12 col-6-m col-9-l pad-right-20-l"
                >
                  <h1>👋 Welcome to my website!</h1>
                  <p>
                    As you might have read in the title, my name is Nicholas
                    Griffin and I am a web developer, blogger and technology
                    enthusiast from the UK.
                  </p>
                  <p>
                    I spend most of my time doing a range of personal web
                    development projects around the web alongside my day job.
                  </p>
                  <p>
                    I aim to use this website to not only showcase myself but
                    also start working on a range of other personal projects.
                    You can follow my expeditions below.
                  </p>
                  <div id="OpeningContentSocial">
                    <a
                      target="_blank"
                      href="https://github.com/nicholasgriffintn"
                      rel="noopener"
                      title="Github"
                      className={styles['social-icon-wrap']}
                      id="GithubLinkWrap"
                    >
                      <svg
                        xmlns="http://www.w3.org/2000/svg"
                        viewBox="0 0 512 512"
                      >
                        <path d="M256 0C115.39 0 0 115.39 0 256c0 119.988 84.195 228.984 196 256v-84.695c-11.078 2.425-21.273 2.496-32.55-.828-15.13-4.465-27.423-14.543-36.548-29.91-5.816-9.813-16.125-20.454-26.879-19.672l-2.636-29.883c23.254-1.992 43.37 14.168 55.312 34.23 5.305 8.922 11.41 14.153 19.246 16.465 7.575 2.23 15.707 1.16 25.184-2.187 2.379-18.973 11.07-26.075 17.637-36.075v-.015c-66.68-9.946-93.254-45.32-103.801-73.242-13.977-37.075-6.477-83.391 18.238-112.66.48-.571 1.348-2.063 1.012-3.106-11.332-34.23 2.476-62.547 2.984-65.55 13.078 3.866 15.203-3.892 56.809 21.386l7.191 4.32c3.008 1.793 2.063.77 5.07.543 17.372-4.719 35.684-7.324 53.727-7.558 18.18.234 36.375 2.84 54.465 7.75l2.328.234c-.203-.031.633-.149 2.035-.984 51.973-31.481 50.106-21.192 64.043-25.723.504 3.008 14.13 31.785 2.918 65.582-1.512 4.656 45.059 47.3 19.246 115.754-10.547 27.933-37.117 63.308-103.797 73.254v.015c8.547 13.028 18.817 19.957 18.762 46.832V512c111.809-27.016 196-136.012 196-256C512 115.39 396.61 0 256 0zm0 0"></path>
                      </svg>
                    </a>
                    <a
                      target="_blank"
                      href="https://twitter.com/NGriffintn"
                      rel="noopener"
                      title="Twitter"
                      className={styles['social-icon-wrap']}
                      id="TwitterLinkWrap"
                    >
                      <svg
                        xmlns="http://www.w3.org/2000/svg"
                        viewBox="0 0 512 512"
                      >
                        <path
                          d="M512 97.248c-19.04 8.352-39.328 13.888-60.48 16.576 21.76-12.992 38.368-33.408 46.176-58.016-20.288 12.096-42.688 20.64-66.56 25.408C411.872 60.704 384.416 48 354.464 48c-58.112 0-104.896 47.168-104.896 104.992 0 8.32.704 16.32 2.432 23.936-87.264-4.256-164.48-46.08-216.352-109.792-9.056 15.712-14.368 33.696-14.368 53.056 0 36.352 18.72 68.576 46.624 87.232-16.864-.32-33.408-5.216-47.424-12.928v1.152c0 51.008 36.384 93.376 84.096 103.136-8.544 2.336-17.856 3.456-27.52 3.456-6.72 0-13.504-.384-19.872-1.792 13.6 41.568 52.192 72.128 98.08 73.12-35.712 27.936-81.056 44.768-130.144 44.768-8.608 0-16.864-.384-25.12-1.44C46.496 446.88 101.6 464 161.024 464c193.152 0 298.752-160 298.752-298.688 0-4.64-.16-9.12-.384-13.568 20.832-14.784 38.336-33.248 52.608-54.496z"
                          fill="#03a9f4"
                        ></path>
                      </svg>
                    </a>
                    <a
                      target="_blank"
                      href="https://www.linkedin.com/in/nicholasgriffin-gb/"
                      rel="noopener"
                      title="LinkedIn"
                      className={styles['social-icon-wrap']}
                      id="LinkedinLinkWrap"
                    >
                      <svg
                        xmlns="http://www.w3.org/2000/svg"
                        viewBox="0 0 382 382"
                      >
                        <path
                          d="M347.445 0H34.555C15.471 0 0 15.471 0 34.555v312.889C0 366.529 15.471 382 34.555 382h312.889C366.529 382 382 366.529 382 347.444V34.555C382 15.471 366.529 0 347.445 0zM118.207 329.844c0 5.554-4.502 10.056-10.056 10.056H65.345c-5.554 0-10.056-4.502-10.056-10.056V150.403c0-5.554 4.502-10.056 10.056-10.056h42.806c5.554 0 10.056 4.502 10.056 10.056v179.441zM86.748 123.432c-22.459 0-40.666-18.207-40.666-40.666S64.289 42.1 86.748 42.1s40.666 18.207 40.666 40.666-18.206 40.666-40.666 40.666zM341.91 330.654a9.247 9.247 0 0 1-9.246 9.246H286.73a9.247 9.247 0 0 1-9.246-9.246v-84.168c0-12.556 3.683-55.021-32.813-55.021-28.309 0-34.051 29.066-35.204 42.11v97.079a9.246 9.246 0 0 1-9.246 9.246h-44.426a9.247 9.247 0 0 1-9.246-9.246V149.593a9.247 9.247 0 0 1 9.246-9.246h44.426a9.247 9.247 0 0 1 9.246 9.246v15.655c10.497-15.753 26.097-27.912 59.312-27.912 73.552 0 73.131 68.716 73.131 106.472v86.846z"
                          fill="#0077b7"
                        ></path>
                      </svg>
                    </a>
                  </div>
                </div>
                <div className="col-12 col-6-m col-3-l pad-top-10 pad-top-0-m">
                  <div id="spotify-widget">
                    {spotify && spotify.track && spotify.track.length > 0 ? (
                      <>
                        <div className="spotify-widget-latest">
                          <div
                            className="spotify-widget-latest-background"
                            style={{
                              backgroundImage: `url(${
                                spotify.track[0].image.find(
                                  (element) => element.size === 'extralarge'
                                )['#text']
                              })`,
                            }}
                          ></div>
                          <div className="spotify-widget-latest-overlay">
                            <h3>{spotify.track[0].name}</h3>
                            <span>{spotify.track[0].artist['#text']}</span>
                            <span>{spotify.track[0].album['#text']}</span>
                            <a
                              className="trackLinkPlay"
                              rel="noopener nofollow"
                              target="_blank"
                              href={spotify.track[0].url}
                            >
                              <svg
                                xmlns="http://www.w3.org/2000/svg"
                                viewBox="0 0 60 60"
                              >
                                <path d="M45.563 29.174l-22-15A1 1 0 1 0 22 15v30a.999.999 0 0 0 1.563.826l22-15a1 1 0 0 0 0-1.652zM24 43.107V16.893L43.225 30 24 43.107z"></path>
                                <path d="M30 0C13.458 0 0 13.458 0 30s13.458 30 30 30 30-13.458 30-30S46.542 0 30 0zm0 58C14.561 58 2 45.439 2 30S14.561 2 30 2s28 12.561 28 28-12.561 28-28 28z"></path>
                              </svg>
                            </a>
                          </div>
                        </div>
                        <div className="spotify-widget-tracks">
                          {spotify.track.map((track, index) => {
                            if (index !== 0) {
                              return (
                                <div
                                  className="spotify-widget-track-item"
                                  key={`spotify-track-item-${index}`}
                                >
                                  <div className="spotify-widget-track-item-image">
                                    <img
                                      src={
                                        track.image.find(
                                          (element) => element.size === 'medium'
                                        )['#text']
                                      }
                                      alt={track.album['#text']}
                                    />
                                  </div>
                                  <div className="spotify-widget-track-item-content">
                                    <a
                                      className="trackLinkPlay"
                                      rel="noopener nofollow"
                                      target="_blank"
                                      href={track.url}
                                    >
                                      <h3>{track.name}</h3>
                                      <span>{track.artist['#text']}</span>
                                      <span>{track.album['#text']}</span>
                                    </a>
                                  </div>
                                </div>
                              );
                            }
                          })}
                        </div>
                      </>
                    ) : null}
                  </div>
                  <span id="MusicOpeningWrapperTitle">
                    What I'm listening to{' '}
                    <svg
                      xmlns="http://www.w3.org/2000/svg"
                      viewBox="0 0 407.437 407.437"
                    >
                      <path d="M386.258 91.567l-182.54 181.945L21.179 91.567 0 112.815 203.718 315.87l203.719-203.055z"></path>
                    </svg>
                  </span>
                </div>
              </div>
            </div>
          </Element>
        </section>
        <section
          className={styles.wrap}
          style={{
            background: '#093054',
            background:
              '-webkit-gradient(left top,right bottom,color-stop(0, #093054),color-stop(100%, #061e35))',
            background: 'linear-gradient(135deg, #093054, #061e35)',
            color: '#fff',
          }}
        >
          <Element name="blog" id="blog" className={styles.container}>
            <div>
              <div id="BlogPostOpenerWrapper">
                <h2>What's going on?</h2>
                <p>
                  Below you will find some of the blog posts that I have wrote
                  (if that is still working), I used to write a lot and I'm
                  looking to write blog posts more about the projects that I am
                  working on. There might not be a lot here but I hope that it
                  will at least be interesting, at least to me.
                </p>
                <div style={{ minHeight: '160px' }}></div>
              </div>
            </div>
          </Element>
        </section>
        <section className={styles.wrap}>
          <Element name="blogPosts" id="blogPosts" className={styles.container}>
            <div>
              <div id="BlogPostsFloatingBlock">
                <div className="item-cards">
                  {posts && posts.length > 0
                    ? posts.map((post, index) => {
                        return (
                          <Link
                            key={`hp_post_${index}`}
                            href={`/blog/${post.id}`}
                          >
                            <a className="item-card">
                              <div
                                className="item-image"
                                style={{
                                  backgroundImage: `url(${post.thumbnail})`,
                                }}
                              ></div>
                              <div className="item-content">
                                <h3>{post.title}</h3>
                                <p>{post.description}</p>
                                {post.createdAt ? (
                                  <span className="item-card__meta">
                                    Posted:{' '}
                                    {dayjs(post.createdAt).format(
                                      'dddd, MMMM D YYYY h:mm a'
                                    )}
                                  </span>
                                ) : null}
                                {post.createdAt !== post.updatedAt ? (
                                  <span className="item-card__meta">
                                    Updated:{' '}
                                    {dayjs(post.updatedAt).format(
                                      'dddd, MMMM D YYYY h:mm a'
                                    )}
                                  </span>
                                ) : null}
                              </div>
                            </a>
                          </Link>
                        );
                      })
                    : null}
                </div>
                {postsAllowLoadMore === true ? (
                  <div className="posts-load-more-wrap">
                    <button className="button" onClick={() => fetchPosts(true)}>
                      Load more
                    </button>
                  </div>
                ) : null}
              </div>
            </div>
          </Element>
        </section>
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
            {github && github.data && github.data.length > 0 ? (
              <div className="item-cards">
                {github.data.map((repo) => {
                  return (
                    <a
                      href={repo.html_url}
                      target="_blank"
                      rel="noopener noreferer"
                      className="item-card"
                      key={`item-card-${repo.id}`}
                      data-github={repo.full_name}
                    >
                      <div className="item-content">
                        <h3>{repo.name}</h3>
                        <p>{repo.description}</p>
                        {repo.language ? (
                          <span className="item-card__meta">
                            <span
                              className="item-card__language-icon"
                              style={{
                                color:
                                  repo.language === 'JavaScript'
                                    ? '#f7df1c'
                                    : repo.language === 'PHP'
                                    ? '#777bb4'
                                    : repo.language === 'HTML'
                                    ? '#e34f25'
                                    : repo.language === 'Vue'
                                    ? '#42b883'
                                    : '#ccc',
                              }}
                            >
                              ●
                            </span>{' '}
                            {repo.language}
                          </span>
                        ) : null}
                      </div>
                    </a>
                  );
                })}
              </div>
            ) : null}
          </Element>
        </section>
        <section className={styles.wrap}>
          <Element name="Langauges" id="Langauges" className={styles.container}>
            <div style={{ textAlign: 'center' }}>
              <h2
                style={{
                  marginBotom: '1.5rem',
                  paddingBotom: '1.5rem',
                  display: 'inline-block',
                  width: '100%',
                }}
              >
                Languages that I often write in
              </h2>
              <div className="grid">
                <div className="row">
                  <div className="col-1-4 icon-grid-item col-2-l">
                    <img
                      width="50px"
                      height="50px"
                      className="lazy"
                      alt="GraphQL"
                      loading="lazy"
                      src="/uploads/langaugesIcons/graphql.svg"
                    />
                    <span>GraphQL</span>
                  </div>
                  <div className="col-1-4 icon-grid-item col-2-l">
                    <img
                      width="50px"
                      height="50px"
                      className="lazy"
                      alt="JavaScript"
                      loading="lazy"
                      src="/uploads/langaugesIcons/javascript.svg"
                    />
                    <span>JavaScript</span>
                  </div>
                  <div className="col-1-4 icon-grid-item col-2-l">
                    <img
                      width="50px"
                      height="50px"
                      className="lazy"
                      alt="TypeScript"
                      loading="lazy"
                      src="/uploads/langaugesIcons/typescript.svg"
                    />
                    <span>TypeScript</span>
                  </div>
                  <div className="col-1-4 icon-grid-item col-2-l">
                    <img
                      width="50px"
                      height="50px"
                      className="lazy"
                      alt="SASS"
                      loading="lazy"
                      src="/uploads/langaugesIcons/sass.svg"
                    />
                    <span>SASS</span>
                  </div>
                  <div className="col-1-4 icon-grid-item col-2-l">
                    <img
                      width="50px"
                      height="50px"
                      className="lazy"
                      alt="JSON"
                      loading="lazy"
                      src="/uploads/langaugesIcons/json.svg"
                    />
                    <span>JSON</span>
                  </div>
                  <div className="col-1-4 icon-grid-item col-2-l">
                    <img
                      width="50px"
                      height="50px"
                      className="lazy"
                      alt="React"
                      loading="lazy"
                      src="/uploads/langaugesIcons/react.svg"
                    />
                    <span>React (JSX)</span>
                  </div>
                </div>
              </div>
            </div>
          </Element>
        </section>
        <section className={styles.wrap}>
          <Element name="Tools" id="Tools" className={styles.container}>
            <div style={{ textAlign: 'center' }}>
              <h2
                style={{
                  marginBotom: '1.5rem',
                  paddingBotom: '1.5rem',
                  display: 'inline-block',
                  width: '100%',
                }}
              >
                Tools that I often use
              </h2>
              <div className="grid">
                <div className="row">
                  <div className="col-1-4 icon-grid-item col-2-l">
                    <img
                      width="50px"
                      height="50px"
                      className="lazy"
                      alt="Redis"
                      loading="lazy"
                      src="/uploads/langaugesIcons/redis.svg"
                    />
                    <span>Redis</span>
                  </div>
                  <div className="col-1-4 icon-grid-item col-2-l">
                    <img
                      width="50px"
                      height="50px"
                      className="lazy"
                      alt="CloudFlare"
                      loading="lazy"
                      src="/uploads/langaugesIcons/cloudflare.svg"
                    />
                    <span>CloudFlare</span>
                  </div>
                  <div className="col-1-4 icon-grid-item col-2-l">
                    <img
                      width="50px"
                      height="50px"
                      className="lazy"
                      alt="NPM"
                      loading="lazy"
                      src="/uploads/langaugesIcons/npm.svg"
                    />
                    <span>NPM</span>
                  </div>
                  <div className="col-1-4 icon-grid-item col-2-l">
                    <img
                      width="50px"
                      height="50px"
                      className="lazy"
                      alt="Next.JS"
                      loading="lazy"
                      src="/uploads/langaugesIcons/nextjs.svg"
                    />
                    <span>Next.JS</span>
                  </div>
                  <div className="col-1-4 icon-grid-item col-2-l">
                    <img
                      width="50px"
                      height="50px"
                      className="lazy"
                      alt="Gatsby"
                      loading="lazy"
                      src="/uploads/langaugesIcons/gatsby.svg"
                    />
                    <span>Gatsby</span>
                  </div>
                  <div className="col-1-4 icon-grid-item col-2-l">
                    <img
                      width="50px"
                      height="50px"
                      className="lazy"
                      alt="PostgresSQL"
                      loading="lazy"
                      src="/uploads/langaugesIcons/postgresql.svg"
                    />
                    <span>PostgresSQL</span>
                  </div>
                  <div className="col-1-4 icon-grid-item col-2-l">
                    <img
                      width="50px"
                      height="50px"
                      className="lazy"
                      alt="Git"
                      loading="lazy"
                      src="/uploads/langaugesIcons/git.svg"
                    />
                    <span>Git</span>
                  </div>
                  <div className="col-1-4 icon-grid-item col-2-l">
                    <img
                      width="50px"
                      height="50px"
                      className="lazy"
                      alt="Google Analytics"
                      loading="lazy"
                      src="/uploads/langaugesIcons/googleanalytics.svg"
                    />
                    <span>Google Analytics</span>
                  </div>
                  <div className="col-1-4 icon-grid-item col-2-l">
                    <img
                      width="50px"
                      height="50px"
                      className="lazy"
                      alt="NGINX"
                      loading="lazy"
                      src="/uploads/langaugesIcons/nginx.svg"
                    />
                    <span>NGINX</span>
                  </div>
                  <div className="col-1-4 icon-grid-item col-2-l">
                    <img
                      width="50px"
                      height="50px"
                      className="lazy"
                      alt="Netlify"
                      loading="lazy"
                      src="/uploads/langaugesIcons/netlify.svg"
                    />
                    <span>Netlify</span>
                  </div>
                  <div className="col-1-4 icon-grid-item col-2-l">
                    <img
                      width="50px"
                      height="50px"
                      className="lazy"
                      alt="NodeJS"
                      loading="lazy"
                      src="/uploads/langaugesIcons/nodejs.svg"
                    />
                    <span>NodeJS</span>
                  </div>
                  <div className="col-1-4 icon-grid-item col-2-l">
                    <img
                      width="50px"
                      height="50px"
                      className="lazy"
                      alt="AWS"
                      loading="lazy"
                      src="/uploads/langaugesIcons/aws.svg"
                    />
                    <span>AWS</span>
                  </div>
                  <div className="col-1-4 icon-grid-item col-2-l">
                    <img
                      width="50px"
                      height="50px"
                      className="lazy"
                      alt="Sentry"
                      loading="lazy"
                      src="/uploads/langaugesIcons/sentry.svg"
                    />
                    <span>Sentry</span>
                  </div>
                  <div className="col-1-4 icon-grid-item col-2-l">
                    <img
                      width="50px"
                      height="50px"
                      className="lazy"
                      alt="Yarn"
                      loading="lazy"
                      src="/uploads/langaugesIcons/yarn.svg"
                    />
                    <span>Yarn</span>
                  </div>
                  <div className="col-1-4 icon-grid-item col-2-l">
                    <img
                      width="50px"
                      height="50px"
                      className="lazy"
                      alt="Visual Studio Code"
                      loading="lazy"
                      src="/uploads/langaugesIcons/visualstudiocode.svg"
                    />
                    <span>Visual Studio / Code</span>
                  </div>
                  <div className="col-1-4 icon-grid-item col-2-l">
                    <img
                      width="50px"
                      height="50px"
                      className="lazy"
                      alt="Webpack"
                      loading="lazy"
                      src="/uploads/langaugesIcons/webpack.svg"
                    />
                    <span>Webpack</span>
                  </div>
                  <div className="col-1-4 icon-grid-item col-2-l">
                    <img
                      width="50px"
                      height="50px"
                      className="lazy"
                      alt="Docker"
                      loading="lazy"
                      src="/uploads/langaugesIcons/docker.svg"
                    />
                    <span>Docker</span>
                  </div>
                  <div className="col-1-4 icon-grid-item col-2-l">
                    <img
                      width="50px"
                      height="50px"
                      className="lazy"
                      alt="Elastic Search"
                      loading="lazy"
                      src="/uploads/langaugesIcons/elasticsearch.svg"
                    />
                    <span>Elastic Search</span>
                  </div>
                </div>
              </div>
              <div
                style={{
                  display: 'inline-block',
                  width: '100%',
                  height: '20px',
                }}
              ></div>
              <small>And last but not least...</small>
              <div
                style={{
                  display: 'inline-block',
                  width: '100%',
                  height: '20px',
                }}
              ></div>
              <div className="grid">
                <div className="row">
                  <div className="col-12 icon-grid-item">
                    <img
                      width="50px"
                      height="50px"
                      className="lazy"
                      alt="Stack Overflow"
                      loading="lazy"
                      src="/uploads/langaugesIcons/stackoverflow.svg"
                    />
                    <span>
                      Stack Overflow (it's always good to be honest xD)
                    </span>
                  </div>
                </div>
              </div>
            </div>
          </Element>
        </section>
      </main>
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
    </div>
  );
}
