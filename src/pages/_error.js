import React, { useState, useEffect } from 'react';
import Image from 'next/image';
import { useAppContext } from '../context/store';

import PageLayout from '../components/pageLayout';

const ErrorPage = ({ statusCode = 500 }) => {
  const { logger } = useAppContext();

  const [failImage, setFailImage] = useState(null);
  const [failData, setFailData] = useState({});

  useEffect(() => {
    const giphy = {
      baseURL: 'https://api.giphy.com/v1/gifs/',
      apiKey: '0UTRbFtkMxAplrohufYco5IY74U8hOes',
      tag: statusCode === 404 ? 'lost' : 'burning',
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
      .catch((err) => logger.error(err));
  }, [statusCode]);

  return (
    <PageLayout
      displayHeader={true}
      title={
        statusCode === 404
          ? 'That page could not be found'
          : `Sorry, but there was an error!`
      }
      description={
        statusCode === 404
          ? 'Try heading back to my homepage'
          : `Code: ${statusCode}`
      }
    >
      <div
        style={{
          textAlign: 'center',
          maxWidth: '780px',
          margin: '0 auto',
          height: 'auto',
          position: 'relative',
          minHeight: '450px',
        }}
      >
        {failImage ? (
          <Image
            src={failImage}
            alt="Everything is fine..."
            layout="fill"
            quality={80}
            objectFit="contain"
          />
        ) : null}
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
            <a target="_blank" rel="noopener noreferrer" href={failData.url}>
              GIPHY
            </a>{' '}
            {failData.user ? (
              <>
                and was uploaded by{' '}
                <a
                  target="_blank"
                  rel="noopener noreferrer"
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
};

ErrorPage.getInitialProps = ({ res, err }) => {
  const statusCode = res ? res.statusCode : err ? err.statusCode : 404;
  return { statusCode };
};

export default ErrorPage;
