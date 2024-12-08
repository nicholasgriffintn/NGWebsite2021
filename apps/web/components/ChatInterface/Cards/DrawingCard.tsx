import { ImageCard } from "./ImageCard";

export function DrawingCard({
	data,
}: {
	data: {
		drawingUrl: {
			key: string;
		};
		paintingUrl: {
			key: string;
		};
	};
}) {
	const getImageUrl = (key: string) => {
		return `https://assistant-assets.nickgriffin.uk/${key}`;
	};

	return (
		<div>
			{data.drawingUrl?.key && (
				<ImageCard
					url={getImageUrl(data.drawingUrl.key)}
					width={1024}
					height={1024}
					prompt="Drawing"
				/>
			)}
			{data.paintingUrl?.key && (
				<ImageCard
					url={getImageUrl(data.paintingUrl.key)}
					width={1024}
					height={1024}
					prompt="Painting"
				/>
			)}
		</div>
	);
}
