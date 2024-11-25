import { PageLayout } from '@/components/PageLayout';
import { InnerPage } from '@/components/InnerPage';
import { getBlogPosts } from '@/lib/blog';
import { BlogCard } from '@/components/BlogCard';
import { Link } from '@/components/Link';

export const metadata = {
  title: 'Blog',
  description:
    'A collection of blog posts that I have written alongside some general thoughts and links.',
};

async function getData(showArchived = false) {
  const posts = await getBlogPosts(showArchived);

  return {
    posts,
  };
}

export default async function Home({ searchParams }) {
  const { showArchived } = await searchParams;
  const data = await getData(showArchived);

  return (
    <PageLayout>
      <InnerPage>
        <h1 className="text-2xl md:text-4xl font-bold text-primary-foreground">
          Blog
        </h1>
        <div className="grid grid-cols-5 gap-4">
          <div className="col-span-5 md:col-span-3 lg:col-span-4 pt-5">
            <div className="text-primary-foreground lg:max-w-[75%]">
              <p>
                I've been running my own blogs since 2011, I started off with my
                own technology blog called TechNutty. I worked on that for just
                short of 7 years, during which time I also ran this personal
                site and have been updating it since.
              </p>
              <p>
                Check out my latest posts below, if you prefer RSS, you can find
                a <Link href="/rss">feed for that here</Link>.
              </p>
            </div>
          </div>
        </div>
        {data?.posts && (
          <div className="grid grid-cols-1 md:grid-cols-3 lg:grid-cols-3 gap-4">
            {data.posts.map((post) => (
              <BlogCard key={post.slug} post={post} />
            ))}
          </div>
        )}
        {!showArchived && (
          <p className="text-muted-foreground pt-5">
            By default, archived posts are not shown. If you would like to see
            them, you can do so by appending <code>?showArchived=true</code> to
            the URL, or by clicking{' '}
            <Link href="/blog?showArchived=true" muted>
              here
            </Link>
            .
          </p>
        )}
      </InnerPage>
    </PageLayout>
  );
}
