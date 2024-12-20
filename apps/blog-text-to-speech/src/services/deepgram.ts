import { StorageService } from "./storage";

export class DeepgramService {
    private baseUrl = "https://api.deepgram.com/v1/speak";
    private model = "aura-luna-en";

    constructor(private apiKey: string) {}

    async uploadObject(text: string, storageService: StorageService, slug: string): Promise<string> {
        if (!this.apiKey) {
            throw new Error("DEEPGRAM_API_KEY is not set");
        }

        const response = await fetch(`${this.baseUrl}?model=${this.model}`, {
            method: 'POST',
            headers: {
                'Authorization': `Token ${this.apiKey}`,
                'Content-Type': 'text/plain',
            },
            body: text,
        });

        if (!response.ok) {
            throw new Error(`Deepgram API error: ${response.status} ${response.statusText}`);
        }

        const audioBuffer = await response.arrayBuffer();
        const audioKey = `audio/${slug}.mp3`;
        
        await storageService.uploadObject(audioKey, audioBuffer);
        
        return audioKey;
    }
}