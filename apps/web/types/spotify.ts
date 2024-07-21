export type RecentTracks = {
  recenttracks: {
    track: {
      mbid: string;
      name: string;
      artist: {
        '#text': string;
      };
      album: {
        '#text': string;
      };
      url: string;
      image: {
        size: string;
        '#text': string;
      }[];
      '@attr': {
        nowplaying: string;
      };
    }[];
  };
};
