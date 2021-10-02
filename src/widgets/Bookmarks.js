import Image from 'next/image';
import ReturnImageFormattingUrl from '../utils/returnImageFormattingUrl';
import { useAppContext } from '../context/store';
import { useQuery } from 'react-query';
import { GraphQLClient, gql } from 'graphql-request';
import config from '../config';
import dayjs from 'dayjs';

const bookmarksClient = new GraphQLClient(config.bookmarks_api, {});

const BookmarksWidget = ({}) => {
  const { isLoading, error, data } = useQuery('get-bookmarks', async () => {
    const { bookmarks } = await bookmarksClient.request(
      gql`
        query {
          bookmarks {
            id
            status
            subject
            recieved
            toName
            toAddress
            fromName
            fromAddress
            bookmark
            url
            title
            description
            screenshot
          }
        }
      `,
      {}
    );
    return bookmarks;
  });

  return (
    <div id="bookmarks-widget">
      {isLoading === true ? (
        <p>Please wait just one sec while the bookmarks load...</p>
      ) : error ? (
        <p>An error occurred while fetching the bookmarks.</p>
      ) : (
        <>
          {data && data.length > 0 ? (
            <div className="item-cards">
              {data.map((bookmark) => {
                if (bookmark) {
                  return (
                    <div
                      className="item-card item-card-half"
                      key={`item-card-${bookmark.id}`}
                    >
                      {bookmark.screenshot ? (
                        <div className="item-image">
                          <Image
                            alt={bookmark.title}
                            src={ReturnImageFormattingUrl(bookmark.screenshot)}
                            layout="fill"
                            objectFit="cover"
                            quality={80}
                            placeholder="blur"
                            blurDataURL={`/_next/image?url=${ReturnImageFormattingUrl(
                              bookmark.screenshot
                            )}&w=16&q=1`}
                          />
                        </div>
                      ) : null}
                      <div className="item-content">
                        <h3>{bookmark.title}</h3>
                        <div className="item-card__meta">
                          <small>
                            Saved:{' '}
                            {dayjs(bookmark.recieved).format(
                              'dddd, MMMM D YYYY h:mm a'
                            )}
                          </small>
                        </div>
                        <p>{bookmark.description}</p>

                        <span className="item-card__actions">
                          <a
                            href={bookmark.url}
                            target="_blank"
                            className="button button-prime-inverted"
                            rel="noopener noreferrer"
                          >
                            Visit Bookmark
                          </a>
                        </span>
                      </div>
                    </div>
                  );
                }
              })}
            </div>
          ) : (
            <p>
              Sorry, I haven&apos;t saved any Bookmarks yet! Please come back
              later.
            </p>
          )}
        </>
      )}
    </div>
  );
};

export default BookmarksWidget;
