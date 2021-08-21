import styles from '../../styles/Home.module.css';

import { Element } from 'react-scroll';

const WhatIDo = ({ github }) => {
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
  );
};

export default WhatIDo;
