import type { Projects } from '@/types/projects';
import type { GitHubProjects } from '@/types/github';
import { ProjectCard } from '@/components/ProjectCard';

export function FeaturedProjectsList({
  firstFeaturedProjects,
  repos,
  lastFeaturedProjects,
}: {
  firstFeaturedProjects?: Projects;
  repos?: GitHubProjects;
  lastFeaturedProjects?: Projects;
}) {
  return (
    <section>
      <ul className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-4">
        {firstFeaturedProjects?.map((project) => (
          <ProjectCard key={project.name} project={project} />
        ))}
      </ul>
      {repos && repos.length > 0 && (
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
      <ul className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-2 gap-4 mt-4">
        {lastFeaturedProjects?.map((project) => (
          <ProjectCard key={project.name} project={project} />
        ))}
      </ul>
    </section>
  );
}
