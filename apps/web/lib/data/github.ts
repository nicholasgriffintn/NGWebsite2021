import type { GitHubProjects, GitHubGists } from '@/types/github';

export async function getGitHubRepos({
  limit = 8,
  offset = 1,
}): Promise<GitHubProjects | undefined> {
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
    console.error('Error fetching data from GitHub', res.statusText);
    return;
  }

  const data = await res.json();

  return data as GitHubProjects;
}

export async function getGitHubGists(): Promise<GitHubGists | undefined> {
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
    console.error('Error fetching data from GitHub', res.statusText);
    return;
  }

  const data = await res.json();

  return data as GitHubGists;
}
