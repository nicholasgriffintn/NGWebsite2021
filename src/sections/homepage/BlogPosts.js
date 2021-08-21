import styles from '../../styles/Home.module.css';
import { Element } from 'react-scroll';

import BlogPostsWidget from '../../widgets/BlogPosts';

const BlogPosts = ({ posts, postsAllowLoadMore, fetchPosts }) => {
  return (
    <section className={styles.wrap}>
      <Element name="blogPosts" id="blogPosts" className={styles.container}>
        <div id="BlogPostsFloatingBlock">
          <BlogPostsWidget
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
