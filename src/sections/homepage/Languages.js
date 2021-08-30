import styles from '../../styles/Home.module.css';
import Image from 'next/image';
import { Element } from 'react-scroll';
import { useAppContext } from '../../context/store';

const Languages = () => {
  const { darkMode } = useAppContext();
  const { darkModeActive } = darkMode;

  return (
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
                <Image
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
                <Image
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
                <Image
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
                <Image
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
                <Image
                  width="50px"
                  height="50px"
                  className="lazy"
                  alt="JSON"
                  loading="lazy"
                  src={
                    darkModeActive === true
                      ? '/uploads/langaugesIcons/json_dark.svg'
                      : '/uploads/langaugesIcons/json.svg'
                  }
                />
                <span>JSON</span>
              </div>
              <div className="col-1-4 icon-grid-item col-2-l">
                <Image
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
  );
};

export default Languages;
