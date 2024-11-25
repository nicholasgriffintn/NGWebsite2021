import { notFound } from 'next/navigation';

import { PageLayout } from '@/components/PageLayout';
import { InnerPage } from '@/components/InnerPage';
import { formatDate, getBlogPosts, getBlogPostBySlug } from '@/lib/blog';
import { CustomMDX } from '@/components/MDX';
import { parseMarkdown } from '@/lib/markdown';
import { Image } from '@/components/Image';
import { AlertMessage } from '@/components/Alert';
import { Link } from '@/components/Link';

export const dynamicParams = false;

// TODO: The article isn't full width, also the archived message doesn't look great and images aren't full width

export async function generateStaticParams() {
  const posts = getBlogPosts(true);

  return posts.map((post) => ({
    slug: post.slug,
  }));
}

export async function generateMetadata({ params }) {
  const { slug } = await params;
  const post = getBlogPostBySlug(slug);

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
  const post = getBlogPostBySlug(slug);

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
              <div>{parseMarkdown(post.metadata.description || '')}</div>
              {post.metadata.tags && (
                <div className="text-sm text-muted-foreground flex flex-wrap items-center space-x-2 mb-2">
                  <span className="text-sm text-muted-foreground">Tags:</span>
                  {post.metadata.tags.map((tag) => (
                    <Link key={tag} href={`/tags/${tag}`} muted>
                      {tag}
                    </Link>
                  ))}
                </div>
              )}
              {post.metadata.date && (
                <span className="text-sm text-muted-foreground">
                  Published on {formatDate(post.metadata.date)}
                </span>
              )}
              {post.metadata.updated && (
                <>
                  <span className="text-sm text-muted-foreground"> • </span>
                  <span className="text-sm text-muted-foreground">
                    Updated on {formatDate(post.metadata.updated)}
                  </span>
                </>
              )}
            </div>
          </div>
          {post.metadata.image && !post.metadata.hideFeaturedImage && (
            <div className="col-span-5 md:col-span-2 lg:col-span-1">
              <Image
                src={post.metadata.image}
                alt={post.metadata.imageAlt || post.metadata.title}
                className="w-full h-full object-cover rounded-lg"
              />
            </div>
          )}
        </div>
        {post.metadata.draft && (
          <AlertMessage
            variant="warning"
            title="This post is a draft!"
            description="This post is a draft and may not be finished."
          />
        )}
        {post.metadata.archived && (
          <AlertMessage
            variant="warning"
            title="This post has been archived!"
            description="This post has been archived due to it being from a previous version of my site, or a bit too old. Some things might be broken and it may not be up to date."
          />
        )}
        <article className="prose dark:prose-invert pt-2 w-full min-w-full lg:min-w-[75%]">
          <CustomMDX source={post.content} />
        </article>
      </InnerPage>
    </PageLayout>
  );
}
