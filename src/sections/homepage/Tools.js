import styles from '../../styles/Home.module.css';
import Image from 'next/image';
import { Element } from 'react-scroll';
import { useAppContext } from '../../context/store';

const Languages = () => {
  const { darkMode } = useAppContext();
  const { darkModeActive } = darkMode;

  return (
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
                <Image
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
                <Image
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
                <Image
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
                <Image
                  width="50px"
                  height="50px"
                  className="lazy"
                  alt="Next.JS"
                  loading="lazy"
                  src={
                    darkModeActive === true
                      ? '/uploads/langaugesIcons/nextjs_dark.svg'
                      : '/uploads/langaugesIcons/nextjs.svg'
                  }
                />
                <span>Next.JS</span>
              </div>
              <div className="col-1-4 icon-grid-item col-2-l">
                <Image
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
                <Image
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
                <Image
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
                <Image
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
                <Image
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
                <Image
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
                <Image
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
                <Image
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
                <Image
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
                <Image
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
                <Image
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
                <Image
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
                <Image
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
                <Image
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
                <Image
                  width="50px"
                  height="50px"
                  className="lazy"
                  alt="Stack Overflow"
                  loading="lazy"
                  src="/uploads/langaugesIcons/stackoverflow.svg"
                />
                <span>Stack Overflow (it's always good to be honest xD)</span>
              </div>
            </div>
          </div>
        </div>
      </Element>
    </section>
  );
};

export default Languages;
