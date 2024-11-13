interface ReplicateCardProps {
  name: string;
  data: any;
}

const normalizeOutput = (output: any) => {
  return Array.isArray(output) ? output : [output];
};

const ImageOutput = ({ output, data }: { output: any[]; data: any }) => (
  <>
    <span className="prose dark:prose-invert text-xs">
      Note: If the image doesn't immediately display, please reselect the chat
      in a couple seconds, we don't auto refresh these just yet. Also, these are
      currently deleted after an hour, we'll look at saving them in our own
      storage as this solution expands.
    </span>
    <div className="mt-2">
      {output.length &&
        output.map((image, index) => (
          <img
            className="h-auto max-w-full rounded-md"
            key={index}
            src={image}
            alt={`Generated image for prompt ${data.input.prompt}`}
            width={data.input.width}
            height={data.input.height}
            loading="lazy"
          />
        ))}
    </div>
  </>
);

const VideoOutput = ({ output, data }: { output: any[]; data: any }) => (
  <>
    <span className="prose dark:prose-invert text-xs">
      Note: If the video player doesn't immediately display, please reselect the
      chat in a couple seconds, we don't auto refresh these just yet. Also,
      these are currently deleted after an hour, we'll look at saving them in
      our own storage as this solution expands.
    </span>
    <div className="mt-2">
      {output.length &&
        output.map((video, index) => (
          <video
            key={index}
            controls
            className="w-full aspect-video rounded-md"
            width={data.input.width}
            height={data.input.height}
          >
            <source src={video} type="video/mp4" />
            Your browser does not support the video tag.
          </video>
        ))}
    </div>
  </>
);

const AudioOutput = ({ output, data }: { output: any[]; data: any }) => (
  <>
    <span className="prose dark:prose-invert text-xs">
      Note: If the audio player doesn't immediately display, please reselect the
      chat in a couple seconds, we don't auto refresh these just yet. Also,
      these are currently deleted after an hour, we'll look at saving them in
      our own storage as this solution expands.
    </span>
    <div className="mt-2">
      {output.length &&
        output.map((audio, index) => (
          <audio key={index} controls className="rounded-md">
            <source src={audio} type="audio/mpeg" />
            Your browser does not support the audio tag.
          </audio>
        ))}
    </div>
  </>
);

export function ReplicateCard({ name, data }: ReplicateCardProps) {
  const output = normalizeOutput(data.output);

  switch (name) {
    case 'create_image':
      return <ImageOutput output={output} data={data} />;
    case 'create_video':
      return <VideoOutput output={output} data={data} />;
    case 'create_music':
      return <AudioOutput output={output} data={data} />;
    default:
      return null;
  }
}
