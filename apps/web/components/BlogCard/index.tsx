import { formatDate } from '@/lib/blog';
import { Link } from '@/components/Link';
import { Card, CardContent, CardHeader, CardTitle } from '@/components/ui/card';
import { Badge } from '@/components/ui/badge';
import { parseMarkdown } from '@/lib/markdown';
import { Image } from '@/components/Image';
import { Bookmark } from 'lucide-react';

export function BlogCard({ post }) {
  const postLink = post.metadata.link || `/blog/${post.slug}`;
  const isBookmark = post.metadata.isBookmark;
  const postContent = parseMarkdown(
    post.metadata.description || post.content,
    false
  );

  return (
    <Card className="overflow-hidden relative">
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
        <CardTitle>
          {isBookmark && (
            <div className="mb-2">
              <Bookmark className="h-5 w-5 text-white fill-white" />
            </div>
          )}
          {isBookmark && !post.metadata.link ? (
            <div className="text-2xl font-semibold leading-none tracking-tight space-x-2 leading-7">
              {post.metadata.title}
            </div>
          ) : (
            <Link
              className="text-2xl font-semibold leading-none tracking-tight space-x-2 leading-7"
              href={postLink}
              target={post.metadata.link ? '_blank' : undefined}
              underline={false}
            >
              {post.metadata.title}
            </Link>
          )}
          {post.metadata.archived && <Badge>Archived</Badge>}
          {post.metadata.draft && <Badge>Draft</Badge>}
        </CardTitle>
      </CardHeader>
      <CardContent>
        <div className="text-sm text-primary-foreground mb-4">
          {postContent}
          {!isBookmark && !post.metadata.link && (
            <span>
              <Link href={postLink}>Read more</Link>
            </span>
          )}
        </div>
        <div className="text-sm text-muted-foreground mb-4">
          {post.metadata.date && (
            <span>
              Published: {formatDate(post.metadata.date)}
              {post.metadata.updated && ' (Updated)'}
            </span>
          )}
          {post.metadata.tags && (
            <div className="flex flex-wrap items-center space-x-2">
              {post.metadata.tags.map((tag) => (
                <Link key={tag} href={`/tags/${tag}`} muted>
                  #{tag}
                </Link>
              ))}
            </div>
          )}
        </div>
      </CardContent>
    </Card>
  );
}
