import { AudioCard } from './AudioCard';
import { VideoCard } from './VideoCard';
import { ImageCard } from './ImageCard';

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
          <ImageCard
            key={index}
            url={image}
            width={data.input.width}
            height={data.input.height}
            prompt={data.input.prompt}
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
          <VideoCard
            key={index}
            url={video}
            width={data.input.width}
            height={data.input.height}
          />
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
        output.map((audio, index) => <AudioCard key={index} url={audio} />)}
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
