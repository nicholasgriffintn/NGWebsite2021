import { useState, useEffect } from 'react';
import styles from '../../styles/Page.module.css';

import API from '@aws-amplify/api';
import { sortedPosts } from '../../graphql/queries';
import PageLayout from '../../components/pageLayout';

import BlogPostsWidget from '../../widgets/BlogPosts';

export default function Page() {
  const [posts, setPosts] = useState([]);
  const [loading, setLoading] = useState(true);
  const [postsNextToken, setPostsNextToken] = useState(null);
  const [postsStartedAt, setPostsStartedAt] = useState(null);
  const [postsAllowLoadMore, setPostsAllowLoadMore] = useState(false);

  const fetchPosts = async function fetchPosts(loadMore) {
    const postData = await API.graphql({
      query: sortedPosts,
      variables:
        loadMore === true && postsNextToken
          ? {
              status: 'PUBLISHED',
              sortDirection: 'DESC',
              limit: 4,
              nextToken: postsNextToken,
            }
          : {
              status: 'PUBLISHED',
              sortDirection: 'DESC',
              limit: 10,
            },
      authMode: 'AWS_IAM',
    });

    if (
      postData &&
      postData.data &&
      postData.data.sortedPosts &&
      postData.data.sortedPosts.items
    ) {
      setLoading(false);
      if (postData.data.sortedPosts.items.length > 0) {
        setPostsAllowLoadMore(false);
        if (loadMore === true) {
          const oldPosts = posts;
          const newPosts = postData.data.sortedPosts.items;

          setPosts([...oldPosts, ...newPosts]);
        } else {
          setPosts(postData.data.sortedPosts.items);
        }

        if (postData.data.sortedPosts.nextToken) {
          setPostsNextToken(postData.data.sortedPosts.nextToken);
          setPostsAllowLoadMore(true);
        }

        if (postData.data.sortedPosts.startedAt) {
          setPostsStartedAt(postData.data.sortedPosts.startedAt);
        }
      } else {
        setPostsAllowLoadMore(false);
      }
    }
  };

  useEffect(() => {
    fetchPosts();
  }, []);

  return (
    <PageLayout
      title="Blog Posts"
      hideContent={true}
      showHero={false}
      loadingState={false}
      darkMain={false}
    >
      <div className="standard-page-content">
        <div className={styles['flex-grid']}>
          <div className={styles.col} style={{ width: '66.66%' }}>
            <h1>Blog Posts</h1>
            <p>
              I&apos;ve been running my own blogs since 2011, I started off with
              my own technology blog that I used to talk about my passion in
              technology, TechNutty.
            </p>
            <p>
              I worked on that for just short of 7 years, during which time I
              also ran this personal site and have been updating it since.
            </p>
            <p>Check out my latest posts below.</p>
            <BlogPostsWidget
              posts={posts}
              postsAllowLoadMore={postsAllowLoadMore}
              fetchPosts={fetchPosts}
              loading={loading}
            />
          </div>
        </div>
      </div>
    </PageLayout>
  );
}
