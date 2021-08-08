import { useState, useEffect } from 'react';

import { API } from 'aws-amplify';
import { getPost, listPosts } from '../../graphql/queries';
import Markdown from 'react-markdown';
import Image from 'next/image';

import dayjs from 'dayjs';

import { useRouter } from 'next/router';

import styles from '../../styles/Page.module.css';

import PageLayout from '../../components/pageLayout';

import { Prism as SyntaxHighlighter } from 'react-syntax-highlighter';
import { materialDark } from 'react-syntax-highlighter/dist/cjs/styles/prism';

/* const gfm = require('remark-gfm');
const rehypeRaw = require('rehype-raw'); */

export default function PostComponent({ post = {}, errored = false }) {
  const router = useRouter();

  const [failImage, setFailImage] = useState(null);
  const [failData, setFailData] = useState({});
  const [hasErrored, setHasErrored] = useState(errored);

  useEffect(() => {
    if (hasErrored === true || errored === true) {
      const giphy = {
        baseURL: 'https://api.giphy.com/v1/gifs/',
        apiKey: '0UTRbFtkMxAplrohufYco5IY74U8hOes',
        tag: 'fire',
        type: 'random',
        rating: 'pg-13',
      };

      let giphyURL = encodeURI(
        giphy.baseURL +
          giphy.type +
          '?api_key=' +
          giphy.apiKey +
          '&tag=' +
          giphy.tag +
          '&rating=' +
          giphy.rating
      );

      fetch(giphyURL)
        .then((res) => res.json())
        .then((data) => {
          if (data && data.data) {
            setFailData(data.data);
            if (data.data.images && data.data.images.downsized_large) {
              setFailImage(data.data.images.downsized_large.url);
            } else if (data.data.image_original_url) {
              setFailImage(data.data.image_original_url);
            }
          }
        })
        .catch((err) => console.error(err));
    }
  }, [hasErrored, errored]);

  return (
    <PageLayout
      loadingState={router.isFallback}
      hideContent={post && post.title ? true : false}
      title={
        router.isFallback
          ? 'Please wait while we load the contents of this post...'
          : !post || !post.title
          ? "Whoops, it looks like there's been a issue retrieving that..."
          : post.title
      }
      description={post.description ? post.description : null}
      status={post.status ? post.status : 'LOADING'}
      tags={post.tags ? post.tags : null}
      thumbnail={post.thumbnail ? post.thumbnail : null}
      header={post.header ? post.header : null}
      ctime={post.ctime ? post.ctime : null}
      _version={post._version ? post._version : null}
      _deleted={post._deleted ? post._deleted : null}
      _lastChangedAt={post._lastChangedAt ? post._lastChangedAt : null}
      createdAt={post.createdAt ? post.createdAt : null}
      updatedAt={post.updatedAt ? post.updatedAt : null}
      owner={post.owner ? post.owner : null}
      comments={post.comments ? post.comments : null}
    >
      {router.isFallback ? (
        <p></p>
      ) : !post || !post.title ? (
        <div className={styles.postContentErrorWrap}>
          <div style={{ textAlign: 'center' }}>
            <img
              style={{ maxWidth: '780px', margin: '0 auto', height: 'auto' }}
              src={failImage}
              alt="Everything is fine..."
            />
          </div>
          <br></br>
          {failData && failData.url ? (
            <div style={{ textAlign: 'center' }}>
              <small
                style={{
                  textAlign: 'center',
                  maxWidth: '480px',
                  margin: '0 auto',
                }}
              >
                {failData.title} was retrieved from{' '}
                <a target="_blank" rel="noopener noreferer" href={failData.url}>
                  GIPHY
                </a>{' '}
                {failData.user ? (
                  <>
                    and was uploaded by{' '}
                    <a
                      target="_blank"
                      rel="noopener noreferer"
                      href={failData.user.profile_url}
                    >
                      {failData.user.display_name}
                    </a>
                  </>
                ) : null}
              </small>
            </div>
          ) : null}
        </div>
      ) : (
        <div className={styles.postContentWrap}>
          <h1>{post.title}</h1>
          <p>{post.description}</p>
          <small>
            Posted: {dayjs(post.createdAt).format('dddd, MMMM D YYYY h:mm a')}
          </small>
          {post.createdAt !== post.updatedAt ? (
            <small>
              Updated:{' '}
              {dayjs(post.updatedAt).format('dddd, MMMM D YYYY h:mm a')}
            </small>
          ) : null}
          <hr />
          {/* <picture>
            <source
              srcSet={`https://api.nicholasgriffin.dev/api/images/resize?image=posts/${post.id}/header.png&width=639&height=1000&position=left%20top, https://api.nicholasgriffin.dev/api/images/resize?image=posts/${post.id}/header.png&width=1278&height=1000&position=left%20top 2x`}
              media="(max-width: 639px)"
            />
            <source
              srcSet={`https://api.nicholasgriffin.dev/api/images/resize?image=posts/${post.id}/header.png&width=1023&height=500, https://api.nicholasgriffin.dev/api/images/resize?image=posts/${post.id}/header.png&width=1680&height=500 2x`}
              media="(min-width: 640px) and (max-width: 1023px)"
            />
            <source
              srcSet={`https://api.nicholasgriffin.dev/api/images/resize?image=posts/${post.id}/header.png&width=1680&height=500`}
              media="(min-width: 1024px)"
            />
            <img
              src={`https://api.nicholasgriffin.dev/api/images/resize?image=posts/${post.id}/header.png&width=1680&height=500`}
              loading="lazy"
              alt={post.title}
            />
          </picture> */}
          <Markdown
            components={{
              p: ({ node, children }) => {
                if (node.children[0].tagName === 'img') {
                  const image = node.children[0];
                  return (
                    <div className="post-image">
                      {/* <picture>
                        <source
                          srcSet={`https://api.nicholasgriffin.dev/api/images/resize?image=${image.properties.src}&width=639&height=1000&position=left%20top, https://api.nicholasgriffin.dev/api/images/resize?image=posts/${post.id}/header.png&width=1278&height=1000&position=left%20top 2x`}
                          media="(max-width: 639px)"
                        />
                        <source
                          srcSet={`https://api.nicholasgriffin.dev/api/images/resize?image=${image.properties.src}&width=1023&height=500, https://api.nicholasgriffin.dev/api/images/resize?image=posts/${post.id}/header.png&width=1680&height=500 2x`}
                          media="(min-width: 640px) and (max-width: 1023px)"
                        />
                        <source
                          srcSet={`https://api.nicholasgriffin.dev/api/images/resize?image=${image.properties.src}&width=1680&height=500`}
                          media="(min-width: 1024px)"
                        />
                        <img
                          src={`https://api.nicholasgriffin.dev/api/images/resize?image=${image.properties.src}&width=1680&height=500`}
                          loading="lazy"
                          alt={image.properties.alt}
                        />
                      </picture> */}

                      <img
                        src={image.properties.src}
                        loading="lazy"
                        alt={image.properties.alt}
                      />
                    </div>
                  );
                }
                // Return default child if it's not an image
                return <p>{children}</p>;
              },
              code({ className, children }) {
                // Removing "language-" because React-Markdown already added "language-"
                const language = className
                  ? className.replace('language-', '')
                  : null;
                return (
                  <SyntaxHighlighter
                    style={materialDark}
                    language={language}
                    children={children[0]}
                  />
                );
              },
            }}
            children={post.content}
          />
        </div>
      )}
    </PageLayout>
  );
}

const fetchPosts = async function fetchPosts() {
  const postData = await API.graphql({
    query: listPosts,
    variables: {},
    authMode: 'AWS_IAM',
  });

  return postData;
};

const fetchPost = async function fetchPost(id) {
  const postData = await API.graphql({
    query: getPost,
    variables: { id },
    authMode: 'AWS_IAM',
  });

  return postData;
};

export async function getStaticPaths(req) {
  const posts = await fetchPosts();
  const paths =
    posts && posts.data && posts.data.listPosts && posts.data.listPosts.items
      ? posts.data.listPosts.items.map((post) => ({ params: { id: post.id } }))
      : {};
  return {
    paths,
    fallback: true,
  };
}

export async function getStaticProps(req) {
  const { params } = req;
  const { id } = params;
  if (id) {
    const post = await fetchPost(id);

    if (post && post.data && post.data.getPost) {
      return {
        props: {
          post: JSON.parse(JSON.stringify(post.data.getPost)),
          errored: false,
        },
        revalidate: 1,
      };
    }
  }

  return {
    props: { post: {}, errored: true },
    revalidate: 1,
  };
}
