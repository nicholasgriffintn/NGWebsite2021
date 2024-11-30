import * as webllm from '@mlc-ai/web-llm';

export class WebLLMService {
  private static instance: WebLLMService;
  private engine: webllm.MLCEngineInterface | null = null;
  private isInitialized: boolean = false;
  private chatHistory: webllm.ChatCompletionMessageParam[] = [];
  private currentModel: string | null = null;

  private constructor() {}

  public static getInstance(): WebLLMService {
    if (!WebLLMService.instance) {
      WebLLMService.instance = new WebLLMService();
    }
    return WebLLMService.instance;
  }

  getCurrentModel(): string | null {
    return this.currentModel;
  }

  async init(
    model: string,
    progressCallback?: (report: webllm.InitProgressReport) => void
  ): Promise<void> {
    if (!this.isInitialized || this.currentModel !== model) {
      if (this.engine) {
        await this.unload();
      }
      this.engine = await webllm.CreateMLCEngine(model, {
        initProgressCallback: progressCallback,
      });
      this.isInitialized = true;
      this.currentModel = model;
    }
  }

  async generate(
    prompt: string,
    onProgress?: (text: string) => void
  ): Promise<string> {
    if (!this.engine) {
      throw new Error('Engine not initialized');
    }

    this.chatHistory.push({ role: 'user', content: prompt });

    const request: webllm.ChatCompletionRequest = {
      messages: this.chatHistory,
      stream: true,
    };

    let generatedContent = '';
    const asyncChunkGenerator = await this.engine.chat.completions.create(
      request
    );

    for await (const chunk of asyncChunkGenerator) {
      const delta = chunk.choices[0]?.delta?.content || '';
      if (onProgress && delta) {
        onProgress(delta);
      }
      generatedContent += delta;
    }

    this.chatHistory.push({
      role: 'assistant',
      content: generatedContent,
    });

    return generatedContent;
  }

  async resetChat(): Promise<void> {
    if (!this.engine) {
      throw new Error('Engine not initialized');
    }
    await this.engine.resetChat();
    this.chatHistory = [];
  }

  async unload(): Promise<void> {
    if (this.engine) {
      await this.engine.unload();
      this.engine = null;
      this.isInitialized = false;
      this.chatHistory = [];
      this.currentModel = null;
    }
  }
}
