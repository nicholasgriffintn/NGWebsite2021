import styles from '../../styles/Home.module.css';
import Link from 'next/link';
import dayjs from 'dayjs';

import { Element } from 'react-scroll';

const BlogPosts = ({ posts, postsAllowLoadMore }) => {
  return (
    <section className={styles.wrap}>
      <Element name="blogPosts" id="blogPosts" className={styles.container}>
        <div>
          <div id="BlogPostsFloatingBlock">
            <div className="item-cards">
              {posts && posts.length > 0
                ? posts.map((post, index) => {
                    return (
                      <Link key={`hp_post_${index}`} href={`/blog/${post.id}`}>
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
                <button
                  className="button button-prime-inverted"
                  onClick={() => fetchPosts(true)}
                >
                  Load more posts
                </button>
              </div>
            ) : null}
          </div>
        </div>
      </Element>
    </section>
  );
};

export default BlogPosts;
