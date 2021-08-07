import { useState, useEffect } from 'react';

import { withSSRContext } from 'aws-amplify';
import { Post } from '../../models';
import Markdown from 'react-markdown';
import { useRouter } from 'next/router';

import PageLayout from '../../components/pageLayout';

export default function PostComponent({ post = {}, errored = false }) {
  const router = useRouter();

  const [failImage, setFailImage] = useState(null);
  const [failData, setFailData] = useState({});
  const [hasErrored, setHasErrored] = useState(errored);

  useEffect(() => {
    const giphy = {
      baseURL: 'https://api.giphy.com/v1/gifs/',
      apiKey: '0UTRbFtkMxAplrohufYco5IY74U8hOes',
      tag: 'burning',
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
  }, [hasErrored]);

  if (router.isFallback) {
    return (
      <PageLayout title="Please wait while we load the contents of this post...">
        <p></p>
      </PageLayout>
    );
  }
  if (!post || !post.title) {
    return (
      <PageLayout title="Whoops, it looks like there's been a issue retrieving that...">
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
      </PageLayout>
    );
  }
  return (
    <PageLayout title={post.title}>
      <h1>{post.title}</h1>
      <Markdown children={post.content} />
    </PageLayout>
  );
}

export async function getStaticPaths(req) {
  const { DataStore } = withSSRContext(req);
  const posts = await DataStore.query(Post);
  const paths = posts.map((post) => ({ params: { id: post.id } }));
  return {
    paths,
    fallback: true,
  };
}

export async function getStaticProps(req) {
  const { DataStore } = withSSRContext(req);
  const { params } = req;
  const { id } = params;
  const post = await DataStore.query(Post, id);

  if (post) {
    return {
      props: {
        post: JSON.parse(JSON.stringify(post)),
        errored: false,
      },
      revalidate: 1,
    };
  }

  return {
    props: { post: {}, errored: true },
    revalidate: 1,
  };
}
