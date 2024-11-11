import { PageLayout } from '@/components/PageLayout';
import { InnerPage } from '@/components/InnerPage';
import { db } from '@/lib/db';
import { bookmarks as bookmarksTable } from '@/lib/db/schema';

export const runtime = 'edge';

// TODO: Add bookmark submission: https://github.com/nicholasgriffintn/NGWebsite2021/blob/16930e6c23a6a57a2ff61c1f802bcdd2c35aced4/src/pages/bookmarks.js

export const metadata = {
  title: 'Bookmarks',
  description: 'A collection of bookmarks that I have saved.',
};

async function getData() {
  const bookmarksData = await db.select().from(bookmarksTable);

  return {
    bookmarks: bookmarksData,
  };
}

export default async function Home() {
  const data = await getData();

  return (
    <PageLayout>
      <InnerPage>
        <h1 className="text-2xl md:text-4xl font-bold text-primary-foreground">
          Bookmarks
        </h1>
        <div className="grid grid-cols-5 gap-4">
          <div className="col-span-5 md:col-span-3 lg:col-span-4 pt-5">
            <div className="text-primary-foreground lg:max-w-[75%]">
              <p>
                Here you'll find a list of the things that I'm currently
                reading, or aiming to read soon.
              </p>
              {data.bookmarks.length !== 0 ? (
                <ul>
                  {data.bookmarks.map((bookmark) => (
                    <li key={bookmark.id}>
                      <a
                        href={bookmark.url || '#'}
                        className="text-primary-foreground underline"
                      >
                        {bookmark.title}
                      </a>
                    </li>
                  ))}
                </ul>
              ) : (
                <p>No bookmarks found.</p>
              )}
            </div>
          </div>
        </div>
      </InnerPage>
    </PageLayout>
  );
}
