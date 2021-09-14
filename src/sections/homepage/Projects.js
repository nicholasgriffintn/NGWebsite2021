import styles from '../../styles/Home.module.css';
import { Element } from 'react-scroll';
import { useAppContext } from '../../context/store';

import FeaturedProjectsWidget from '../../widgets/FeaturedProjects';

const FeaturedProjects = ({}) => {
  const { fetchProjects } = useAppContext();
  return (
    <section
      className={styles.wrap}
      style={{ marginBottom: 0, paddingBottom: 0, marginTop: 0, paddingTop: 0 }}
    >
      <Element
        name="featuredProjects"
        id="featuredProjects"
        className={styles.container}
      >
        <FeaturedProjectsWidget fetchProjects={fetchProjects} />
      </Element>
    </section>
  );
};

export default FeaturedProjects;
