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
            bookmark
            toName
            toAddress
            fromName
            fromAddress
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
          {data ? (
            <div className="item-cards">
              {data.map((bookmark) => {
                if (bookmark && bookmark.bookmark) {
                  const bookmarkJSON = JSON.parse(bookmark.bookmark);

                  console.log(bookmark, bookmarkJSON);
                  return (
                    <a
                      href={bookmarkJSON.url}
                      target="_blank"
                      rel="noopener noreferrer"
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
                        <h3>{bookmarkJSON.title}</h3>
                        <div className="item-card__meta">
                          <small>
                            Saved:{' '}
                            {dayjs(bookmark.recieved).format(
                              'dddd, MMMM D YYYY h:mm a'
                            )}
                          </small>
                          <small>
                            From: {bookmark.fromName} ({bookmark.fromAddress})
                          </small>
                        </div>
                        <div className="item-card__tags">
                          <div
                            className={`tag tag-status-${
                              bookmark.status === 'verifed' ? 'good' : 'bad'
                            }`}
                          >
                            {bookmark.status}
                          </div>
                        </div>
                        <p>{bookmarkJSON.description}</p>

                        <span className="item-card__actions">
                          <a
                            href={bookmarkJSON.url}
                            target="_blank"
                            rel="noopener noreferrer"
                          >
                            Visit Bookmark
                          </a>
                        </span>
                      </div>
                    </a>
                  );
                }
              })}
            </div>
          ) : null}
        </>
      )}
    </div>
  );
};

export default BookmarksWidget;
