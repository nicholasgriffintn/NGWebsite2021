export function ImageCard({
  url,
  width,
  height,
  prompt,
}: {
  url: string;
  width: number;
  height: number;
  prompt: string;
}) {
  if (!url) return null;
  return (
    <img
      className="h-auto max-w-full rounded-md"
      src={url}
      alt={`Generated image for prompt ${prompt}`}
      width={width}
      height={height}
      loading="lazy"
    />
  );
}
