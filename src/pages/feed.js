// Next.js API route support: https://nextjs.org/docs/api-routes/introduction

import { API } from 'aws-amplify';
import { sortedPosts } from '../graphql/queries';

const rss = require('rss');

export default (req, res) => {
  // Create rss prototype object and set some base values
  var feed = new rss({
    title: 'Nicholas Griffin',
    description: 'My personal website',
    feed_url: 'https://nicholasgriffin.dev' + req.url,
    site_url: 'https://nicholasgriffin.dev',
    image_url: 'https://nicholasgriffin.dev/icon.png',
    author: 'Nicholas Griffin',
  });

  let where = {};

  const fetchPosts = async function fetchPosts() {
    const postData = await API.graphql({
      query: sortedPosts,
      variables: {
        status: 'PUBLISHED',
        sortDirection: 'ASC',
      },
      authMode: 'AWS_IAM',
    });

    return postData;
  };

  const posts = fetchPosts();

  const rssFeedArticles =
    posts && posts.data && posts.data.listPosts && posts.data.listPosts.items
      ? posts.data.listPosts.items
      : [];

  if (rssFeedArticles) {
    rssFeedArticles.forEach(function (post) {
      feed.item({
        title: post.title,
        description: post.description,
        url: 'http://nicholas.griffin.dev/posts/' + post.id,
        author: 'Nicholas Griffin',
        date: dayjs(post.createdAt).format('dddd, MMMM D YYYY h:mm a'),
      });
    });

    res.type('rss');
    res.send(feed.xml());
  } else {
    res.send(rssFeedArticles);
  }
};
