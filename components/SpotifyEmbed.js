export default function SpotifyEmbed({ url }) {
  if (!url) return null;
  
  const extractSpotifyId = (url) => {
    const match = url.match(/track\/([a-zA-Z0-9]+)/);
    return match ? match[1] : null;
  };

  const spotifyId = extractSpotifyId(url);
  
  if (!spotifyId) return null;

  return (
    <div className="mt-6">
      <div className="flex items-center gap-2 mb-3 text-sm text-gray-600">
        <svg className="w-4 h-4" fill="currentColor" viewBox="0 0 24 24">
          <path d="M12 2C6.48 2 2 6.48 2 12s4.48 10 10 10 10-4.48 10-10S17.52 2 12 2zm0 18c-4.41 0-8-3.59-8-8s3.59-8 8-8 8 3.59 8 8-3.59 8-8 8zm-1-13h2v6h-2zm0 8h2v2h-2z"/>
        </svg>
        <span>A song for you</span>
      </div>
      <iframe
        src={`https://open.spotify.com/embed/track/${spotifyId}`}
        width="100%"
        height="152"
        frameBorder="0"
        allow="encrypted-media"
        className="rounded-xl"
      />
    </div>
  );
}