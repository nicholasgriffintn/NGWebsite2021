import { PageLayout } from '@/components/PageLayout';
import { InnerPage } from '@/components/InnerPage';
import { getBlogPosts } from '@/lib/blog';
import { Link } from '@/components/Link';

// TODO: Make the list of blog posts a little better.

export const metadata = {
  title: 'Blog',
  description: 'A collection of blog posts that I have written.',
};

async function getData() {
  const posts = await getBlogPosts();

  return {
    posts,
  };
}

export default async function Home() {
  const data = await getData();

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
              <p>Check out my latest posts below.</p>
            </div>
          </div>
        </div>
        {data?.posts && (
          <ul>
            {data.posts.map((post) => (
              <li key={post.slug}>
                <Link href={`/blog/${post.slug}`}>{post.metadata.title}</Link>
              </li>
            ))}
          </ul>
        )}
      </InnerPage>
    </PageLayout>
  );
}
