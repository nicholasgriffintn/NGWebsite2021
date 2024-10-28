import { formatDate } from '@/lib/blog';
import { buttonVariants } from '@/components/ui/button';
import { Link } from '@/components/Link';
import { Card, CardContent, CardHeader, CardTitle } from '@/components/ui/card';
import { Badge } from '@/components/ui/badge';
import { parseMarkdown } from '@/lib/markdown';

export function BlogCard({ post }) {
  return (
    <Card className="overflow-hidden">
      {post.metadata.image && (
        <div className="max-h-[190px] min-h-[190px] overflow-hidden">
          <img
            src={post.metadata.image}
            alt={post.metadata.imageAlt || post.metadata.title}
            className="w-full object-cover"
            loading="lazy"
          />
        </div>
      )}
      <CardHeader>
        <CardTitle>
          {post.metadata.title}
          {post.metadata.archived && <Badge>Archived</Badge>}
        </CardTitle>
      </CardHeader>
      <CardContent>
        <div className="text-sm text-muted-foreground">
          {parseMarkdown(post.metadata.description, true)}
        </div>
        {post.metadata.date && (
          <p className="text-sm text-muted-foreground">
            Published on {formatDate(post.metadata.date)}
          </p>
        )}
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
