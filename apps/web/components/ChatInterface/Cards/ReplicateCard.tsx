interface ReplicateCardProps {
  name: string;
  data: any;
}

const normalizeOutput = (output: any) => {
  return Array.isArray(output) ? output : [output];
};

const ImageOutput = ({ output, data }: { output: any[]; data: any }) => (
  <>
    <span className="font-medium">
      Note: If the image doesn't immediately display, please reselect the chat
      in a couple seconds, we don't auto refresh these just yet.
    </span>
    {output.length &&
      output.map((image, index) => (
        <img
          key={index}
          src={image}
          alt={`Generated image for prompt ${data.input.prompt}`}
          width={data.input.width}
          height={data.input.height}
          className="rounded-md"
          loading="lazy"
        />
      ))}
  </>
);

const VideoOutput = ({ output, data }: { output: any[]; data: any }) => (
  <>
    <span className="font-medium">
      Note: If the video player doesn't immediately display, please reselect the
      chat in a couple seconds, we don't auto refresh these just yet.
    </span>
    {output.length &&
      output.map((video, index) => (
        <video
          key={index}
          controls
          className="rounded-md"
          width={data.input.width}
          height={data.input.height}
        >
          <source src={video} type="video/mp4" />
          Your browser does not support the video tag.
        </video>
      ))}
  </>
);

const AudioOutput = ({ output, data }: { output: any[]; data: any }) => (
  <>
    <span className="font-medium">
      Note: If the audio player doesn't immediately display, please reselect the
      chat in a couple seconds, we don't auto refresh these just yet.
    </span>
    {output.length &&
      output.map((audio, index) => (
        <audio key={index} controls className="rounded-md">
          <source src={audio} type="audio/mpeg" />
          Your browser does not support the audio tag.
        </audio>
      ))}
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
