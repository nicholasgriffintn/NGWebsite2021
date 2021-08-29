import Link from 'next/link';
import dayjs from 'dayjs';
import Image from 'next/image';

import ReturnImageFormattingUrl from '../utils/returnImageFormattingUrl';
import React from 'react';

const BlogPostsWidget = ({
  posts,
  postsAllowLoadMore,
  fetchPosts,
  loading,
}) => {
  return (
    <div className="blog-posts-widget">
      {loading === true ? (
        <p>Please wait just one sec while the blog posts load...</p>
      ) : (
        <div className="item-cards">
          {posts && posts.length > 0
            ? posts.map((post, index) => {
                return (
                  <React.Fragment key={`hp_post_${index}`}>
                    {post && post.id ? (
                      <Link href={`/blog/${post.id}`}>
                        <a className="item-card">
                          {post.thumbnail ? (
                            <div className="item-image">
                              <Image
                                alt={post.title}
                                src={ReturnImageFormattingUrl(post.thumbnail)}
                                layout="fill"
                                objectFit="cover"
                                quality={80}
                                placeholder="blur"
                                blurDataURL={`/_next/image?url=${ReturnImageFormattingUrl(
                                  post.thumbnail
                                )}&w=16&q=1`}
                              />
                            </div>
                          ) : null}
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
                    ) : null}
                  </React.Fragment>
                );
              })
            : null}
        </div>
      )}
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
  );
};

export default BlogPostsWidget;
