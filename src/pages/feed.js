import { withSSRContext } from 'aws-amplify';
import { listPosts } from '../graphql/queries';

const Feed = () => {};

export const getServerSideProps = async (context) => {
  const { res } = context;
  const { API } = withSSRContext(context);

  const baseUrl = {
    development: 'http://localhost:3000',
    production: 'https://nicholasgriffin.dev',
  }[process.env.NODE_ENV];

  let latestPostDate = '';
  let rssItemsXml = '';

  const postData = await API.graphql({
    query: listPosts,
    variables: {
      limit: 100,
    },
    authMode: 'AWS_IAM',
  });

  const posts = postData?.data?.listPosts?.items || [];

  posts.forEach(({ id, title, createdAt, description, content }) => {
    const postHref = `${baseUrl}/blog/${id}`;

    if (!latestPostDate || createdAt > latestPostDate) {
      latestPostDate = createdAt;
    }

    rssItemsXml += `
          <item>
            <title><![CDATA[${title}]]></title>
            <link>${postHref}</link>
            <pubDate>${createdAt}</pubDate>
            <guid isPermaLink="false">${postHref}</guid>
            <description>
            <![CDATA[${description}]]>
            </description>
            <content:encoded>
              <![CDATA[${content}]]>
            </content:encoded>
        </item>`;
  });

  const feed = `<?xml version="1.0" ?>
      <rss
        xmlns:dc="http://purl.org/dc/elements/1.1/"
        xmlns:content="http://purl.org/rss/1.0/modules/content/"
        xmlns:atom="http://www.w3.org/2005/Atom"
        version="2.0"
      >
        <channel>
            <title><![CDATA[Nicholas Griffin]]></title>
            <link>${baseUrl}</link>
            <description>
              <![CDATA[Web Developer, Blogger and Technology Enthusiast]]>
            </description>
            <language>en</language>
            <lastBuildDate>${latestPostDate}</lastBuildDate>
            ${rssItemsXml}
        </channel>
      </rss>`;

  res.setHeader('Content-Type', 'text/xml');
  res.write(feed);
  res.end();

  return {
    props: {},
  };
};

export default Feed;
