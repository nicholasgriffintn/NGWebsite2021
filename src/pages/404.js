// _error.js is only used in production. In development you'll get an error with the call stack to know where the error originated from.
import React, { useState, useEffect } from 'react';

import PageLayout from '../components/pageLayout';

const ErrorPage = ({ statusCode = 404 }) => {
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
      .catch((err) => console.error(err));
  }, []);

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
                where it was uploaded by{' '}
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
};

export default ErrorPage;
