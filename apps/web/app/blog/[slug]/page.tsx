import { notFound } from 'next/navigation';

import { PageLayout } from '@/components/PageLayout';
import { InnerPage } from '@/components/InnerPage';
import { formatDate, getBlogPosts } from '@/lib/blog';
import { CustomMDX } from '@/components/MDX';

export async function generateStaticParams() {
  const posts = getBlogPosts();

  return posts.map((post) => ({
    slug: post.slug,
  }));
}

export async function generateMetadata({ params }) {
  const { slug } = await params;
  const post = getBlogPosts().find((post) => post.slug === slug);

  if (!post) {
    return;
  }

  const { title, date: publishedTime, description, image } = post.metadata;
  const ogImage = image
    ? image
    : `https://nicholasgriffin.dev/og?title=${encodeURIComponent(title)}`;

  return {
    title,
    description,
    openGraph: {
      title,
      description,
      type: 'article',
      publishedTime,
      url: `https://nicholasgriffin.dev/blog/${post.slug}`,
      images: [
        {
          url: ogImage,
        },
      ],
    },
    twitter: {
      card: 'summary_large_image',
      title,
      description,
      images: [ogImage],
    },
  };
}

export default async function Home({ params }) {
  const { slug } = await params;
  const post = getBlogPosts().find((post) => post.slug === slug);

  if (!post) {
    notFound();
  }

  return (
    <PageLayout>
      <InnerPage>
        <script
          type="application/ld+json"
          suppressHydrationWarning
          // biome-ignore lint/security/noDangerouslySetInnerHtml: It's on purpose
          dangerouslySetInnerHTML={{
            __html: JSON.stringify({
              '@context': 'https://schema.org',
              '@type': 'BlogPosting',
              headline: post.metadata.title,
              datePublished: post.metadata.date,
              dateModified: post.metadata.date || post.metadata.updated,
              description: post.metadata.description,
              image: post.metadata.image
                ? `https://nicholasgriffin.dev/${post.metadata.image}`
                : `/og?title=${encodeURIComponent(post.metadata.title)}`,
              url: `https://nicholasgriffin.dev/blog/${post.slug}`,
              author: {
                '@type': 'Person',
                name: 'Nicholas Griffin',
              },
            }),
          }}
        />
        <h1 className="text-2xl md:text-4xl font-bold text-primary-foreground">
          {post.metadata.title}
        </h1>
        <div className="grid grid-cols-5 gap-4">
          <div className="col-span-5 md:col-span-3 lg:col-span-4 pt-5">
            <div className="text-primary-foreground lg:max-w-[75%]">
              <p>{post.metadata.description}</p>
              {post.metadata.date && (
                <p className="text-sm text-muted-foreground">
                  Published on {formatDate(post.metadata.date)}
                </p>
              )}
              {post.metadata.updated && (
                <p className="text-sm text-muted-foreground">
                  Updated on {formatDate(post.metadata.updated)}
                </p>
              )}
            </div>
          </div>
          {post.metadata.image && (
            <div className="col-span-5 md:col-span-2 lg:col-span-1">
              <img
                src={post.metadata.image}
                alt={post.metadata.title}
                className="w-full h-full object-cover rounded-lg"
              />
            </div>
          )}
        </div>
        {post.metadata.archived && (
          <div
            className="bg-orange-100 border-l-4 border-orange-500 text-orange-700 p-4"
            role="alert"
          >
            <p className="font-bold">This post has been archived!</p>
            <p>
              This post has been archived due to it being from a previous
              version of my site, or a bit too old. Some things might be broken
              and it may not be up to date.
            </p>
          </div>
        )}
        <article className="prose dark:prose-invert mt-10 border-t-2 pt-10 w-full">
          <CustomMDX source={post.content} />
        </article>
      </InnerPage>
    </PageLayout>
  );
}
