export function VideoCard({
	url,
	width,
	height,
}: {
	url: string;
	width: number;
	height: number;
}) {
	if (!url) return null;
	return (
		<video
			controls
			className="w-full aspect-video rounded-md"
			width={width}
			height={height}
		>
			<source src={url} type="video/mp4" />
			Your browser does not support the video tag.
		</video>
	);
}
