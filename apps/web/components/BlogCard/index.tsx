import { formatDate } from '@/lib/blog';
import { buttonVariants } from '@/components/ui/button';
import { Link } from '@/components/Link';
import {
  Card,
  CardContent,
  CardDescription,
  CardHeader,
  CardTitle,
} from '@/components/ui/card';
import { Badge } from '@/components/ui/badge';

export function BlogCard({ post }) {
  return (
    <Card className="overflow-hidden">
      {post.metadata.image && (
        <img
          src={post.metadata.image}
          alt={post.metadata.imageAlt || post.metadata.title}
          className="w-full"
        />
      )}
      <CardHeader>
        <CardTitle>
          {post.metadata.title}
          {post.metadata.archived && <Badge>Archived</Badge>}
        </CardTitle>
      </CardHeader>
      <CardContent>
        <CardDescription>{post.metadata.description}</CardDescription>
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
