export function AudioCard({ url }: { url: string }) {
  if (!url) return null;
  return (
    <audio controls className="rounded-md">
      <source src={url} type="audio/mpeg" />
      Your browser does not support the audio tag.
    </audio>
  );
}
