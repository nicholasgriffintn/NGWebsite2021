import { getGitHubRepos } from '@/lib/data/github';

export const runtime = 'edge';

export async function GET(req: Request) {
  const { searchParams } = new URL(req.url);
  const limit = searchParams.get('limit')
    ? Number(searchParams.get('limit'))
    : 8;
  const offset = searchParams.get('offset')
    ? Number(searchParams.get('offset'))
    : 1;

  const data = await getGitHubRepos({
    limit,
    offset,
  });

  return Response.json(data, {
    headers: {
      'Cache-Control': 's-maxage=180000',
    },
  });
}
