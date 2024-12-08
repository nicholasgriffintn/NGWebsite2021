import { AudioCard } from "./AudioCard";
import { VideoCard } from "./VideoCard";
import { ImageCard } from "./ImageCard";

interface ReplicateCardProps {
	name: string;
	data: any;
}

const normalizeOutput = (output: any) => {
	return Array.isArray(output) ? output : [output];
};

export function ReplicateCard({ name, data }: ReplicateCardProps) {
	const output = normalizeOutput(data.output);

	return (
		<div className="space-y-4">
			<span className="prose dark:prose-invert text-xs">
				Note: If the content doesn't immediately display, please reselect the
				chat in a couple seconds. We don't auto-refresh these yet. Also, these
				are currently deleted after an hour; we'll look at saving them in our
				own storage as this solution expands.
			</span>
			<div className="mt-2">
				{!output.length && (
					<div className="flex items-center justify-center h-32 bg-muted rounded-lg">
						<span className="text-muted-foreground">Processing...</span>
					</div>
				)}
				{output.length > 0 &&
					output.map((item, index) => (
						<div key={index} className="mt-4">
							{name === "create_image" && (
								<ImageCard
									url={item}
									width={data.input.width}
									height={data.input.height}
									prompt={data.input.prompt}
								/>
							)}
							{name === "create_video" && (
								<VideoCard
									url={item}
									width={data.input.width}
									height={data.input.height}
								/>
							)}
							{name === "create_music" && <AudioCard url={item} />}
						</div>
					))}
			</div>
		</div>
	);
}
