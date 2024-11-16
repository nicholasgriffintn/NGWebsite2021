import { useState } from 'react';
import { Mic, Loader2 } from 'lucide-react';

import {
  Dialog,
  DialogContent,
  DialogDescription,
  DialogHeader,
  DialogTitle,
  DialogTrigger,
} from '@/components/ui/dialog';
import { Input } from '@/components/ui/input';
import { Label } from '@/components/ui/label';
import { Button } from '@/components/ui/button';
import { RadioGroup, RadioGroupItem } from '@/components/ui/radio-group';
import {
  onUploadPodcast,
  onTranscribePodcast,
  onGetChat,
  onSummarisePodcast,
  onGeneratePodcastImage,
} from '@/components/ChatInterface/actions';
import { SpeakerSamples } from './SpeakerSamples';

interface Segment {
  end: number;
  speaker: string;
  text: string;
  start: number;
}

export function SidebarPodcastApp() {
  const [isOpen, setIsOpen] = useState(false);
  const [step, setStep] = useState(1);
  const [audioFile, setAudioFile] = useState<File | null>(null);
  const [audioUrl, setAudioUrl] = useState('');
  const [uploadType, setUploadType] = useState('file');
  const [chatId, setChatId] = useState('');
  const [prompt, setPrompt] = useState('');
  const [numberOfSpeakers, setNumberOfSpeakers] = useState(2);
  const [speakers, setSpeakers] = useState<Record<string, string>>({});
  const [segments, setSegments] = useState<Segment[]>([]);
  const [status, setStatus] = useState('');
  const [isLoading, setIsLoading] = useState(false);

  const handleFileChange = (e: React.ChangeEvent<HTMLInputElement>) => {
    if (e.target.files && e.target.files[0]) {
      setAudioFile(e.target.files[0]);
    }
  };

  const handleUpload = async () => {
    if (
      (uploadType === 'file' && !audioFile) ||
      (uploadType === 'url' && !audioUrl) ||
      isLoading
    ) {
      return;
    }

    setIsLoading(true);
    setStatus('Uploading audio...');

    try {
      const data = await onUploadPodcast(audioUrl);
      if (uploadType === 'file' && audioFile) {
        if (!data.response.data.signedUrl) {
          console.error('Error uploading, no signed URL');
          setStatus('Error uploading');
        }
        const formData = new FormData();
        formData.append('file', audioFile);
        const upload = await fetch(data.response.data.signedUrl, {
          method: 'PUT',
          body: formData,
        });
        if (!upload.ok) {
          console.error('Error uploading file:', upload);
          setStatus('Error uploading file');
        }
      }
      if (!data.response.chatId) {
        console.error('Error uploading, no chat ID');
        setStatus('Error uploading');
      }
      setChatId(data.response.chatId);
      setStep(2);
      setStatus('');
    } catch (error) {
      console.error('Error uploading file:', error);
      setStatus('Error uploading file');
    } finally {
      setIsLoading(false);
    }
  };

  const handleTranscribe = async () => {
    if (isLoading) return;

    setIsLoading(true);
    setStatus('Transcribing podcast...');
    try {
      const data = await onTranscribePodcast(chatId, prompt, numberOfSpeakers);
      if (!data.response.timestamp) {
        console.error('Error transcribing, no timestamp');
        setStatus('Error transcribing');
      }
      await waitForTranscription(chatId, data.response.timestamp);
    } catch (error) {
      console.error('Error transcribing:', error);
      setStatus('Error transcribing');
    } finally {
      setIsLoading(false);
    }
  };

  const waitForTranscription = async (chatId, timestamp) => {
    if (!chatId || !timestamp) {
      return;
    }

    while (true) {
      const data = await onGetChat(chatId);
      const message = data.find((m) => m.timestamp === timestamp);
      if (message && message.data.status === 'succeeded') {
        const uniqueSpeakers = [
          ...new Set(message.data.output.segments.map((s) => s.speaker)),
        ];
        setSpeakers(Object.fromEntries(uniqueSpeakers.map((s) => [s, ''])));
        setSegments(message.data.output.segments);
        setStep(3);
        setStatus('');
        break;
      } else if (message && message.data.status === 'failed') {
        setStatus('Transcription failed');
        break;
      }
      await new Promise((resolve) => setTimeout(resolve, 5000));
    }
  };

  const handleSpeakerIdentification = async () => {
    if (!chatId || !speakers || isLoading) {
      return;
    }

    setIsLoading(true);
    setStatus('Summarising content...');
    try {
      await onSummarisePodcast(chatId, speakers);
      setStep(4);
      setStatus('');
    } catch (error) {
      console.error('Error summarising:', error);
      setStatus('Error summarising');
    } finally {
      setIsLoading(false);
    }
  };

  const handleGenerateImage = async () => {
    if (!chatId || isLoading) {
      return;
    }

    setIsLoading(true);
    setStatus('Generating image...');
    try {
      await onGeneratePodcastImage(chatId);
      setStatus('Process completed successfully!');
      setTimeout(() => {
        setIsOpen(false);
        setStep(1);
        setStatus('');
        setIsLoading(false);
        // Reset other state variables as needed
        setAudioFile(null);
        setChatId('');
        setPrompt('');
        setNumberOfSpeakers(2);
        setSpeakers({});
      }, 3000);
    } catch (error) {
      console.error('Error generating image:', error);
      setStatus('Error generating image');
      setIsLoading(false);
    }
  };

  return (
    <Dialog open={isOpen} onOpenChange={setIsOpen}>
      <DialogTrigger asChild>
        <Button
          variant="outline"
          className="w-full justify-center"
          onClick={() => setIsOpen(true)}
        >
          <Mic className="h-4 w-4" />
          <span className="sr-only">Transcribe</span>
        </Button>
      </DialogTrigger>
      <DialogContent className="sm:max-w-md">
        <DialogHeader>
          <DialogTitle>Generate a Podcast Record</DialogTitle>
          <DialogDescription>
            {step === 1 &&
              'Upload a clip to start with the transcription of the content.'}
            {step === 2 && 'Enter prompt and number of speakers.'}
            {step === 3 && 'Identify speakers.'}
            {step === 4 && 'Generate image for the podcast.'}
          </DialogDescription>
        </DialogHeader>
        {step === 1 && (
          <div className="space-y-4">
            <RadioGroup
              defaultValue="file"
              onValueChange={(value) => setUploadType(value)}
            >
              <div className="flex items-center space-x-2">
                <RadioGroupItem value="file" id="file" />
                <Label htmlFor="file">Upload File</Label>
              </div>
              <div className="flex items-center space-x-2">
                <RadioGroupItem value="url" id="url" />
                <Label htmlFor="url">Provide URL</Label>
              </div>
            </RadioGroup>
            {uploadType === 'file' ? (
              <div className="flex items-end space-x-2">
                <Label className="flex-1">
                  <div className="pb-2">Upload Clip</div>
                  <Input
                    type="file"
                    accept="audio/*"
                    onChange={handleFileChange}
                    disabled={isLoading}
                  />
                </Label>
              </div>
            ) : (
              <div className="flex items-end space-x-2">
                <Label className="flex-1">
                  <div className="pb-2">Audio URL</div>
                  <Input
                    type="url"
                    value={audioUrl || ''}
                    onChange={(e) => setAudioUrl(e.target.value)}
                    placeholder="https://example.com/audio.mp3"
                    disabled={isLoading}
                  />
                </Label>
              </div>
            )}
            <Button
              variant="default"
              onClick={handleUpload}
              disabled={
                (uploadType === 'file' && !audioFile) ||
                (uploadType === 'url' && !audioUrl) ||
                isLoading
              }
            >
              {isLoading ? (
                <>
                  <Loader2 className="mr-2 h-4 w-4 animate-spin" />
                  Uploading
                </>
              ) : (
                'Upload'
              )}
            </Button>
          </div>
        )}
        {step === 2 && (
          <div className="space-y-4">
            <div>
              <Label htmlFor="prompt">Prompt</Label>
              <Input
                id="prompt"
                value={prompt}
                onChange={(e) => setPrompt(e.target.value)}
                placeholder="Enter prompt..."
                disabled={isLoading}
              />
            </div>
            <div>
              <Label htmlFor="speakers">Number of Speakers</Label>
              <Input
                id="speakers"
                type="number"
                value={numberOfSpeakers}
                onChange={(e) => setNumberOfSpeakers(Number(e.target.value))}
                min={1}
                disabled={isLoading}
              />
            </div>
            <Button onClick={handleTranscribe} disabled={!prompt || isLoading}>
              {isLoading ? (
                <>
                  <Loader2 className="mr-2 h-4 w-4 animate-spin" />
                  Transcribing
                </>
              ) : (
                'Transcribe'
              )}
            </Button>
          </div>
        )}
        {step === 3 && (
          <>
            {segments.length > 0 && <SpeakerSamples segments={segments} />}
            <div className="space-y-4">
              {Object.entries(speakers).map(([speaker, name]) => (
                <div key={speaker}>
                  <Label htmlFor={speaker}>{speaker}</Label>
                  <Input
                    id={speaker}
                    value={name}
                    onChange={(e) =>
                      setSpeakers({ ...speakers, [speaker]: e.target.value })
                    }
                    placeholder="Enter speaker name"
                    disabled={isLoading}
                  />
                </div>
              ))}
              <Button
                onClick={handleSpeakerIdentification}
                disabled={
                  Object.values(speakers).some((name) => !name) || isLoading
                }
              >
                {isLoading ? (
                  <>
                    <Loader2 className="mr-2 h-4 w-4 animate-spin" />
                    Identifying Speakers
                  </>
                ) : (
                  'Identify Speakers'
                )}
              </Button>
            </div>
          </>
        )}
        {step === 4 && (
          <Button onClick={handleGenerateImage} disabled={isLoading}>
            {isLoading ? (
              <>
                <Loader2 className="mr-2 h-4 w-4 animate-spin" />
                Generating Image
              </>
            ) : (
              'Generate Image'
            )}
          </Button>
        )}
        {status && (
          <div className="mt-4 text-sm text-muted-foreground">{status}</div>
        )}
      </DialogContent>
    </Dialog>
  );
}
