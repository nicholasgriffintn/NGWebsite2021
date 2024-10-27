import type { Projects } from '@/types/projects';
import type { GitHubProjects } from '@/types/github';
import { ProjectCard } from '@/components/ProjectCard';
import { buttonVariants } from '@/components/ui/button';
import { Link } from '@/components/Link';

export function ProjectsList({
  firstFeaturedProjects,
  featuredRepos,
  lastFeaturedProjects,
  showAll = false,
  repos,
}: {
  firstFeaturedProjects?: Projects;
  featuredRepos?: GitHubProjects;
  lastFeaturedProjects?: Projects;
  showAll?: boolean;
  repos?: GitHubProjects;
}) {
  return (
    <section>
      <ul className="grid grid-cols-1 md:grid-cols-3 lg:grid-cols-3 gap-4">
        {firstFeaturedProjects?.map((project) => (
          <ProjectCard key={project.name} project={project} />
        ))}
      </ul>
      {featuredRepos && featuredRepos.length > 0 && (
        <ul className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-4 mt-4">
          {featuredRepos.map((repo) => (
            <ProjectCard
              key={repo.name}
              project={{
                name: repo.name,
                description: repo.description,
                url: repo.html_url,
              }}
            />
          ))}
        </ul>
      )}
      <ul className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-2 gap-4 mt-4">
        {lastFeaturedProjects?.map((project) => (
          <ProjectCard key={project.name} project={project} />
        ))}
      </ul>
      {!showAll && (
        <div className="w-full flex justify-center pt-5">
          <Link
            href="/projects"
            className={buttonVariants({ variant: 'outline', size: 'lg' })}
            underline={false}
          >
            View all projects
          </Link>
        </div>
      )}
      {showAll && repos && repos.length > 0 && (
        <ul className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-4 mt-4">
          {repos.map((repo) => (
            <ProjectCard
              key={repo.name}
              project={{
                name: repo.name,
                description: repo.description,
                url: repo.html_url,
              }}
            />
          ))}
        </ul>
      )}
    </section>
  );
}
