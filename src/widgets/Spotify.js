const SpotifyWidget = ({ spotify }) => {
  return (
    <div id="spotify-widget">
      {spotify && spotify.track && spotify.track.length > 0 ? (
        <>
          <div className="spotify-widget-latest">
            <div
              className="spotify-widget-latest-background"
              style={{
                backgroundImage: `url(${
                  spotify.track[0].image.find(
                    (element) => element.size === 'extralarge'
                  )['#text']
                })`,
              }}
            ></div>
            <div className="spotify-widget-latest-overlay">
              <h3>{spotify.track[0].name}</h3>
              <span>{spotify.track[0].artist['#text']}</span>
              <span>{spotify.track[0].album['#text']}</span>
              <a
                aria-label={`Play ${spotify.track[0].name}`}
                className="trackLinkPlay"
                rel="noopener nofollow"
                target="_blank"
                href={spotify.track[0].url}
              >
                <svg xmlns="http://www.w3.org/2000/svg" viewBox="0 0 60 60">
                  <path d="M45.563 29.174l-22-15A1 1 0 1 0 22 15v30a.999.999 0 0 0 1.563.826l22-15a1 1 0 0 0 0-1.652zM24 43.107V16.893L43.225 30 24 43.107z"></path>
                  <path d="M30 0C13.458 0 0 13.458 0 30s13.458 30 30 30 30-13.458 30-30S46.542 0 30 0zm0 58C14.561 58 2 45.439 2 30S14.561 2 30 2s28 12.561 28 28-12.561 28-28 28z"></path>
                </svg>
              </a>
            </div>
          </div>
          <div className="spotify-widget-tracks">
            {spotify.track.map((track, index) => {
              if (index !== 0) {
                return (
                  <div
                    className="spotify-widget-track-item"
                    key={`spotify-track-item-${index}`}
                  >
                    <div className="spotify-widget-track-item-image">
                      <img
                        src={
                          track.image.find(
                            (element) => element.size === 'medium'
                          )['#text']
                        }
                        alt={track.album['#text']}
                      />
                    </div>
                    <div className="spotify-widget-track-item-content">
                      <a
                        className="trackLinkPlay"
                        rel="noopener nofollow"
                        target="_blank"
                        href={track.url}
                      >
                        <h3>{track.name}</h3>
                        <span>{track.artist['#text']}</span>
                        <span>{track.album['#text']}</span>
                      </a>
                    </div>
                  </div>
                );
              }
            })}
          </div>
        </>
      ) : null}
    </div>
  );
};

export default SpotifyWidget;
