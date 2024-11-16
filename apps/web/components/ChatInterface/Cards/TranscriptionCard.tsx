import { Card, CardContent, CardHeader, CardTitle } from '@/components/ui/card';
import { Badge } from '@/components/ui/badge';
import { ScrollArea } from '@/components/ui/scroll-area';

interface Segment {
  speaker: string;
  start: number;
  end: number;
  text: string;
}

interface TranscriptionData {
  language: string;
  num_speakers: number;
  segments: Segment[];
}

function formatTime(seconds: number): string {
  const minutes = Math.floor(seconds / 60);
  const remainingSeconds = Math.floor(seconds % 60);
  return `${minutes}:${remainingSeconds.toString().padStart(2, '0')}`;
}

export function TranscriptionCard({ data }: { data: TranscriptionData }) {
  if (!data) return;
  if (!data.segments.length) return;

  return (
    <Card className="w-full max-w-3xl">
      <CardHeader>
        <CardTitle>AI Transcription</CardTitle>
      </CardHeader>
      <CardContent>
        <div className="grid gap-4">
          <div className="flex items-center gap-2">
            <Badge variant="outline">Language</Badge>
            <span>{data.language.toUpperCase()}</span>
          </div>
          <div className="flex items-center gap-2">
            <Badge variant="outline">Number of Speakers</Badge>
            <span>{data.num_speakers}</span>
          </div>
          <div className="mt-4">
            <ScrollArea className="h-[300px] rounded-md border p-4">
              {data.segments.map((segment, index) => (
                <div key={index} className="mb-4">
                  <p className="font-semibold text-sm text-muted-foreground">
                    {segment.speaker} ({formatTime(segment.start)} -{' '}
                    {formatTime(segment.end)})
                  </p>
                  <p className="mt-1">{segment.text}</p>
                </div>
              ))}
            </ScrollArea>
          </div>
        </div>
      </CardContent>
    </Card>
  );
}
