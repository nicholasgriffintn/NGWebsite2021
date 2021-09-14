import styles from '../../styles/Home.module.css';
import { useAppContext } from '../../context/store';

import { Element } from 'react-scroll';

const Blog = () => {
  const { darkMode } = useAppContext();
  const { darkModeActive } = darkMode;

  return (
    <section
      className={styles.wrap}
      style={{
        background: darkModeActive === true ? '#171923' : '#093054',
        background:
          darkModeActive === true
            ? '-webkit-gradient(left top,right bottom,color-stop(0, #171923),color-stop(100%, #252838))'
            : '-webkit-gradient(left top,right bottom,color-stop(0, #093054),color-stop(100%, #061e35))',
        background:
          darkModeActive === true
            ? 'linear-gradient(135deg, #171923, #252838)'
            : 'linear-gradient(135deg, #093054, #061e35)',
        color: '#fff',
      }}
    >
      <Element name="blog" id="blog" className={styles.container}>
        <div>
          <div id="BlogPostOpenerWrapper">
            <h2>What&apos;s going on?</h2>
            <p>
              Below you will find some of the blog posts that I have wrote (if
              that is still working), I used to write a lot and I'm looking to
              write blog posts more about the projects that I am working on.
              There might not be a lot here but I hope that it will at least be
              interesting, at least to me.
            </p>
            <div style={{ minHeight: '160px' }}></div>
          </div>
        </div>
      </Element>
    </section>
  );
};

export default Blog;
