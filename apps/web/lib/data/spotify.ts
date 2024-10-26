import type { RecentTracks } from '@/types/spotify';

export async function getRecentlyPlayed(): Promise<RecentTracks | null> {
  const lastFmToken = process.env.LAST_FM_TOKEN;

  if (!lastFmToken) {
    console.error('No LastFM token found');
    return null;
  }

  const res = await fetch(
    `https://ws.audioscrobbler.com/2.0/?method=user.getrecenttracks&user=NGriiffin&api_key=${lastFmToken}&limit=10&format=json`,
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
    throw new Error('Error fetching data from Audioscrobbler');
  }

  const data = await res.json();

  return data as RecentTracks;
}
