import type { GitHubProjects, GitHubGists } from '@/types/github';

export async function getGitHubRepos({
  limit = 8,
  offset = 1,
}): Promise<GitHubProjects | null> {
  const res = await fetch(
    `https://api.github.com/users/nicholasgriffintn/repos?sort=updated&type=public&per_page=${limit}&page=${offset}`,
    {
      headers: {
        'Content-Type': 'application/json',
        'User-Agent': 'NGWeb',
      },
      next: {
        revalidate: 60,
      },
    }
  );

  if (!res.ok) {
    console.error(res.statusText);
    throw new Error('Error fetching data from GitHub');
  }

  const data = await res.json();

  return data as GitHubProjects;
}

export async function getGitHubGists(): Promise<GitHubGists | null> {
  const res = await fetch(
    'https://api.github.com/users/nicholasgriffintn/gists',
    {
      headers: {
        'Content-Type': 'application/json',
        'User-Agent': 'NGWeb',
      },
      next: {
        revalidate: 60,
      },
    }
  );

  if (!res.ok) {
    console.error(res.statusText);
    throw new Error('Error fetching data from GitHub');
  }

  const data = await res.json();

  return data as GitHubGists;
}
