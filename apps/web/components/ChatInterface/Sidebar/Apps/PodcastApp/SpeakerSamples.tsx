import { ScrollArea } from '@/components/ui/scroll-area';

interface Segment {
  end: number;
  speaker: string;
  text: string;
  start: number;
}

interface SpeakerSamplesProps {
  segments: Segment[];
}

export function SpeakerSamples({ segments = [] }: SpeakerSamplesProps) {
  // Get one sample per unique speaker
  const speakerSamples = Object.values(
    segments.reduce((acc, segment) => {
      if (!acc[segment.speaker]) {
        acc[segment.speaker] = segment;
      }
      return acc;
    }, {} as Record<string, Segment>)
  );

  return (
    <>
      <h3 className="text-sm font-semibold">Speaker Samples</h3>
      <ScrollArea className="h-[200px] w-full rounded-md border p-4">
        {speakerSamples.map((segment, index) => (
          <div key={index} className="mb-4 rounded-lg bg-muted p-3">
            <div className="text-sm font-medium text-muted-foreground">
              {segment.speaker} (Start: {segment.start}, End: {segment.end})
            </div>
            <p className="mt-1 text-sm">{segment.text}</p>
          </div>
        ))}
      </ScrollArea>
    </>
  );
}
