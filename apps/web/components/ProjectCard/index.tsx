import parse from 'html-react-parser';

import {
  Card,
  CardContent,
  CardDescription,
  CardHeader,
  CardTitle,
} from '@/components/ui/card';
import { Link } from '@/components/Link';
import type { Project } from '@/types/projects';
import { buttonVariants } from '@/components/ui/button';

function parseMarkdownLinks(text: string) {
  return text?.replace(
    /\[(.*?)\]\((.*?)\)/g,
    `<a
      href="$2"
      target="_blank"
      rel="noopener noreferer"
      className="underline text-muted-foreground inline font-bold p-0 transition-colors hover:underline hover:outline-none decoration-1 decoration-skip-ink-none underline-offset-[0.25em] hover:decoration-2"
    >
      $1
    </a>`
  );
}

export function ProjectCard({ project }: { project: Project }) {
  return (
    <Card key={project.name} className="overflow-hidden">
      {project.image && (
        <img src={project.image} alt={project.name} className="w-full" />
      )}
      <CardHeader>
        <CardTitle>{project.name}</CardTitle>
      </CardHeader>
      <CardContent>
        {project.description && (
          <CardDescription>
            {parse(parseMarkdownLinks(project.description))}
          </CardDescription>
        )}
        <div className="w-full flex justify-left">
          {project.url && (
            <Link
              href={project.url}
              muted
              target="_blank"
              rel="noopener noreferer"
              className={buttonVariants({ variant: 'outline', size: 'sm' })}
              underline={false}
            >
              View Project
            </Link>
          )}
          {project.links && (
            <div className="flex flex-wrap gap-2">
              {project.links.map((link) => (
                <Link
                  key={link.url}
                  href={link.url}
                  muted
                  target="_blank"
                  rel="noopener noreferer"
                  className={buttonVariants({ variant: 'outline', size: 'sm' })}
                  underline={false}
                >
                  {link.title}
                </Link>
              ))}
            </div>
          )}
        </div>
      </CardContent>
    </Card>
  );
}
