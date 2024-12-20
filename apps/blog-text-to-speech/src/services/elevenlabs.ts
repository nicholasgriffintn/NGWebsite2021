import { StorageService } from "./storage";

export class ElevenLabsService {
    private baseUrl = "https://api.elevenlabs.io/v1/text-to-speech";
    private model = "21m00Tcm4TlvDq8ikWAM";

    constructor(private readonly apiKey: string) {}

    async uploadObject(content: string, storageService: StorageService, key: string): Promise<string> {
        if (!this.apiKey) {
            throw new Error("ELEVEN_LABS_API_KEY is not set");
        }

        const response = await fetch(`${this.baseUrl}/${this.model}`, {
            method: "POST",
            headers: {
                "xi-api-key": this.apiKey,
                "Content-Type": "application/json"
            },
            body: JSON.stringify({ text: content })
        });
        
        if (!response.ok) {
            throw new Error(`Failed to fetch text-to-speech: ${response.statusText}`);
        }
        
        const audio = await response.arrayBuffer();
        
        const audioKey = await storageService.uploadObject(`audio/${key}.mp3`, audio);

        return audioKey;
    }
}