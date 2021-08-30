import styles from '../../styles/Home.module.css';
import { Element } from 'react-scroll';
import { useAppContext } from '../../context/store';

import BlogPostsWidget from '../../widgets/BlogPosts';

const BlogPosts = ({}) => {
  const { loading, posts, postsAllowLoadMore, fetchPosts } = useAppContext();
  return (
    <section className={styles.wrap}>
      <Element name="blogPosts" id="blogPosts" className={styles.container}>
        <div id="BlogPostsFloatingBlock">
          <BlogPostsWidget
            loading={loading}
            posts={posts}
            postsAllowLoadMore={postsAllowLoadMore}
            fetchPosts={fetchPosts}
          />
        </div>
      </Element>
    </section>
  );
};

export default BlogPosts;
