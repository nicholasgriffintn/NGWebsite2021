import styles from '../../styles/Home.module.css';

import { Element } from 'react-scroll';

const OpeningContent = ({ spotify }) => {
  return (
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
                Thanks for visiting my site! As you might have read in the
                title, my name is Nicholas Griffin and I am a Senior Software
                Engineer, Blogger and Technology enthusiast from the UK.
              </p>
              <p>
                Feel free to scroll further down to find out more about me or my
                projects, I've also added my contact links below.
              </p>
              <h3>About Me</h3>
              <p>
                I would classify myself as a Full Stack Developer with a slight
                bias towards frontend. I spend most of my dev time doing a range
                of personal development projects around the web alongside my day
                job.
              </p>
              <p>
                Outside of development, I enjoy the odd read and love to listen
                to music, with an aim to find some good new stuff, however,
                that's mostly about trying to beat the algorithm.
              </p>
              <p>You can find out more about me and my projects below.</p>
              <div id="OpeningContentSocial">
                <a
                  target="_blank"
                  href="https://github.com/nicholasgriffintn"
                  rel="noopener"
                  title="Github"
                  className={styles['social-icon-wrap']}
                  id="GithubLinkWrap"
                >
                  <svg xmlns="http://www.w3.org/2000/svg" viewBox="0 0 512 512">
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
                  <svg xmlns="http://www.w3.org/2000/svg" viewBox="0 0 512 512">
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
                  <svg xmlns="http://www.w3.org/2000/svg" viewBox="0 0 382 382">
                    <path
                      d="M347.445 0H34.555C15.471 0 0 15.471 0 34.555v312.889C0 366.529 15.471 382 34.555 382h312.889C366.529 382 382 366.529 382 347.444V34.555C382 15.471 366.529 0 347.445 0zM118.207 329.844c0 5.554-4.502 10.056-10.056 10.056H65.345c-5.554 0-10.056-4.502-10.056-10.056V150.403c0-5.554 4.502-10.056 10.056-10.056h42.806c5.554 0 10.056 4.502 10.056 10.056v179.441zM86.748 123.432c-22.459 0-40.666-18.207-40.666-40.666S64.289 42.1 86.748 42.1s40.666 18.207 40.666 40.666-18.206 40.666-40.666 40.666zM341.91 330.654a9.247 9.247 0 0 1-9.246 9.246H286.73a9.247 9.247 0 0 1-9.246-9.246v-84.168c0-12.556 3.683-55.021-32.813-55.021-28.309 0-34.051 29.066-35.204 42.11v97.079a9.246 9.246 0 0 1-9.246 9.246h-44.426a9.247 9.247 0 0 1-9.246-9.246V149.593a9.247 9.247 0 0 1 9.246-9.246h44.426a9.247 9.247 0 0 1 9.246 9.246v15.655c10.497-15.753 26.097-27.912 59.312-27.912 73.552 0 73.131 68.716 73.131 106.472v86.846z"
                      fill="#0077b7"
                    ></path>
                  </svg>
                </a>
                <a
                  href="/contact"
                  title="Contact Me"
                  className={styles['social-icon-wrap']}
                  id="ContactLinkWrap"
                >
                  <svg
                    xmlns="http://www.w3.org/2000/svg"
                    viewBox="0 -26 512 512"
                  >
                    <defs />
                    <path
                      fill="#e87288"
                      d="M463.988 240.59C487.7 216.172 502 184.55 502 150c0-77.32-77.629-140-166-140S176 72.68 176 150l160 140c23.61 0 52.031-4.48 72.21-12.512C426.489 297.468 452.782 310 482 310c-18.79-18.79-24.8-45.54-18.012-69.41zm0 0"
                    />
                    <path
                      fill="#cae9fc"
                      d="M258.45 170C304.921 194.5 336 239.07 336 290c0 77.32-71.629 140-160 140-23.61 0-52.031-4.48-72.21-12.512C85.511 437.468 59.218 450 30 450c18.79-18.79 24.8-45.54 18.012-69.41C24.3 356.172 10 324.55 10 290c0-77.32 77.629-140 166-140 30.16 0 58.379 7.3 82.45 20zm0 0"
                    />
                    <path d="M256 100c-5.52 0-10 4.48-10 10s4.48 10 10 10 10-4.48 10-10-4.48-10-10-10zm0 0M90 280c5.52 0 10-4.48 10-10s-4.48-10-10-10-10 4.48-10 10 4.48 10 10 10zm0 0" />
                    <path d="M336 0c-90.027 0-163.918 62.07-169.633 140.254C80.63 144.554 0 206.379 0 290c0 34.945 13.828 68.805 39 95.633 4.98 20.531-1.066 42.293-16.07 57.297A9.998 9.998 0 0030 460c28.52 0 56.004-11.184 76.426-30.89C126.32 435.89 152.277 440 176 440c90.016 0 163.898-62.055 169.629-140.223 20.937-.93 42.715-4.797 59.945-10.668C425.996 308.816 453.48 320 482 320a9.998 9.998 0 007.07-17.07c-15.004-15.004-21.05-36.766-16.07-57.297 25.172-26.828 39-60.688 39-95.633C512 63.113 425.16 0 336 0zM176 420c-23.602 0-50.496-4.633-68.512-11.8a10 10 0 00-11.078 2.538c-12.074 13.2-27.773 22.403-44.879 26.633a80.872 80.872 0 006.098-59.52 9.98 9.98 0 00-2.445-4.226C32.496 350.258 20 320.559 20 290c0-70.469 71.438-130 156-130 79.852 0 150 55.527 150 130 0 71.684-67.29 130-150 130zm280.816-186.375a10.027 10.027 0 00-2.445 4.227 80.872 80.872 0 006.098 59.52c-17.106-4.227-32.805-13.435-44.88-26.634a10.007 10.007 0 00-11.077-2.539c-15.614 6.211-37.887 10.512-58.914 11.551-2.922-37.816-21.786-73.36-54.036-99.75H422c5.523 0 10-4.477 10-10s-4.477-10-10-10H260.84c-22.7-11.555-48.188-18.293-74.422-19.707C192.164 73.129 257.058 20 336 20c84.563 0 156 59.531 156 130 0 30.559-12.496 60.258-35.184 83.625zm0 0" />
                    <path d="M256 260H130c-5.523 0-10 4.477-10 10s4.477 10 10 10h126c5.523 0 10-4.477 10-10s-4.477-10-10-10zm0 0M256 320H90c-5.523 0-10 4.477-10 10s4.477 10 10 10h166c5.523 0 10-4.477 10-10s-4.477-10-10-10zm0 0M422 100H296c-5.523 0-10 4.477-10 10s4.477 10 10 10h126c5.523 0 10-4.477 10-10s-4.477-10-10-10zm0 0" />
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
  );
};

export default OpeningContent;
