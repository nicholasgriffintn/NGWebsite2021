import { formatDate } from '@/lib/blog';
import { buttonVariants } from '@/components/ui/button';
import { Link } from '@/components/Link';
import { Card, CardContent, CardHeader, CardTitle } from '@/components/ui/card';
import { Badge } from '@/components/ui/badge';
import { parseMarkdown } from '@/lib/markdown';
import { Image } from '@/components/Image';

export function BlogCard({ post }) {
  return (
    <Card className="overflow-hidden">
      {post.metadata.image && (
        <div className="max-h-[190px] min-h-[190px] overflow-hidden h-full">
          <Image
            src={post.metadata.image}
            alt={post.metadata.imageAlt || post.metadata.title}
            className="w-full object-cover"
            loading="lazy"
            width={700}
            height={190}
          />
        </div>
      )}
      <CardHeader>
        <CardTitle className="space-x-2">
          <Link
            className="text-2xl font-semibold leading-none tracking-tight space-x-2"
            href={`/blog/${post.slug}`}
            underline={false}
          >
            {post.metadata.title}
          </Link>
          {post.metadata.archived && <Badge>Archived</Badge>}
          {post.metadata.draft && <Badge>Draft</Badge>}
        </CardTitle>
      </CardHeader>
      <CardContent>
        <div className="text-sm text-muted-foreground mb-4">
          {parseMarkdown(post.metadata.description, true)}
        </div>
        <div className="text-sm text-muted-foreground mb-4">
          {post.metadata.date && (
            <span className="text-sm text-primary-foreground">
              Published: {formatDate(post.metadata.date)}
              {post.metadata.updated && ' (Updated)'}
            </span>
          )}
          {post.metadata.tags && (
            <div className="text-sm text-muted-foreground flex flex-wrap items-center space-x-2">
              {post.metadata.tags.map((tag) => (
                <Link
                  key={tag}
                  href={`/tags/${tag}`}
                  className="text-sm text-primary-foreground"
                >
                  {tag}
                </Link>
              ))}
            </div>
          )}
        </div>
        <Link
          href={`/blog/${post.slug}`}
          className={buttonVariants({
            variant: 'outline',
            size: 'sm',
          })}
          underline={false}
        >
          Read More
        </Link>
      </CardContent>
    </Card>
  );
}
