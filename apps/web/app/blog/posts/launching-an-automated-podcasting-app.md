---
title: Launching an Automated Podcasting App
description: Recently I created a new podcasting app that is able to automatically generate a podcast listing from an audio upload, including generating a transcript, speaker identification, and more.
date: 2024-11-16
draft: true
---

Previously, I started work on building an AI based assistant [that you can read about here](/blog/posts/building-my-own-ai-assistant), as time goes on, I plan to expand this with mini applications that the user can open from the assistant and use to complete certain tasks.

One of the first of these is what I'm writing about today, an automated podcasting app. The app is able to automatically generate a podcast listing from an audio upload, including generating a transcript, speaker identification, and more.

## Creating an API to upload audio

```typescript
app.post('/apps/podcasts/upload', async (context) => {
	try {
		const body = await context.req.parseBody();

		const userEmail: string = context.req.headers.get('x-user-email') || '';

		const user = {
			email: userEmail,
		};

		const response = await handlePodcastUpload({
			env: context.env as IEnv,
			audio: body['audio'] as Blob,
			user,
		});

		return context.json({
			response,
		});
	} catch (error) {
		console.error(error);

		return context.json({
			response: 'Something went wrong, we are working on it',
		});
	}
});
```

```typescript
export const handlePodcastUpload = async (req: TranscribeRequest): Promise<IFunctionResponse> => {
	const { audio, env, user } = req;

	if (!audio) {
		return {
			status: 'error',
			content: 'Missing audio',
		};
	}

	const arrayBuffer = await audio.arrayBuffer();

	const length = arrayBuffer.byteLength;

	const itemId = Math.random().toString(36);
	const imageKey = `podcasts/${itemId}/recording.mp3`;

	const data = await env.ASSETS_BUCKET.put(imageKey, arrayBuffer, {
		contentType: 'audio/mp3',
		contentLength: length,
	});

	return {
		status: 'success',
		content: `Podcast Uploaded: [${itemId}](https://assistant-assets.nickgriffin.uk/${imageKey})`,
		name: 'podcast_upload',
		data,
	};
};
```

## Identifying Speakers and Transcribing Audio

https://replicate.com/thomasmol/whisper-diarization

```typescript
export const handlePodcastTranscribe = async (req: TranscribeRequest): Promise<IFunctionResponse | IFunctionResponse[]> => {
	const { request, env, user, appUrl } = req;

	if (!env.REPLICATE_API_TOKEN) {
		throw new Error('Missing REPLICATE_API_TOKEN');
	}

	if (!request.podcastId || !request.prompt || !request.numberOfSpeakers) {
		return {
			status: 'error',
			content: 'Missing podcast id or prompt or number of speakers',
		};
	}

	const chatHistory = ChatHistory.getInstance(env.CHAT_HISTORY);
	const chat = await chatHistory.get(request.podcastId);

	if (!chat?.length) {
		return {
			status: 'error',
			content: 'Podcast not found',
		};
	}

	const baseUrl = getGatewayExternalProviderUrl(env, 'replicate');
	const url = `${baseUrl}/predictions`;

	const headers = {
		Authorization: `Bearer ${env.REPLICATE_API_TOKEN}`,
		'Content-Type': 'application/json',
		Prefer: 'wait=10',
		'cf-aig-metadata': JSON.stringify({
			email: user?.email,
		}),
	};

	const baseWebhookUrl = appUrl || 'https:///assistant.nicholasgriffin.workers.dev';
	const webhookUrl = `${baseWebhookUrl}/webhooks/replicate?chatId=${request.podcastId}&token=${env.WEBHOOK_SECRET}`;

	const body = {
		version: 'cbd15da9f839c5f932742f86ce7def3a03c22e2b4171d42823e83e314547003f',
		input: {
			file: `https://assistant-assets.nickgriffin.uk/podcasts/${request.podcastId}/recording.mp3`,
			prompt: request.prompt,
			language: 'en',
			num_speakers: request.numberOfSpeakers,
			transcript_output_format: 'segments_only',
			group_segments: true,
			translate: false,
			offset_seconds: 0,
		},
		webhook: webhookUrl,
		webhook_events_filter: ['output', 'completed'],
	};

	const data: any = await fetchAIResponse('replicate', url, headers, body);

	const message = {
		role: 'assistant',
		name: 'podcast_transcribe',
		content: `Podcast Transcribed: [${data.id}](${data.url})`,
		data,
	};
	const response = await chatHistory.add(request.podcastId, message);

	return response;
};
```

## Summarizing the Transcript

https://developers.cloudflare.com/workers-ai/models/bart-large-cnn/

```typescript
export const handlePodcastSummarise = async (req: SummariseRequest): Promise<IFunctionResponse | IFunctionResponse[]> => {
	const { request, env, user } = req;

	if (!request.podcastId || !request.speakers) {
		return {
			status: 'error',
			content: 'Missing podcast id',
		};
	}

	const chatHistory = ChatHistory.getInstance(env.CHAT_HISTORY);
	const chat = await chatHistory.get(request.podcastId);

	if (!chat?.length) {
		return {
			status: 'error',
			content: 'Podcast not found',
		};
	}

	const transcriptionData = chat.find((message) => message.name === 'podcast_transcribe');

	if (!transcriptionData?.data?.output) {
		return {
			status: 'error',
			content: 'Transcription not found',
		};
	}

	const transcription = transcriptionData.data.output;
	const fullTranscription = generateFullTranscription(transcription, request.speakers);

	const data = await env.AI.run(
		'@cf/facebook/bart-large-cnn',
		{
			input_text: fullTranscription,
			max_length: 52,
		},
		{
			gateway: {
				id: gatewayId,
				skipCache: false,
				cacheTtl: 3360,
				metadata: {
					email: user?.email,
				},
			},
		}
	);

	if (!data.summary) {
		return {
			status: 'error',
			content: 'No response from the model',
		};
	}

	const message = {
		role: 'assistant',
		name: 'podcast_summarise',
		content: data.summary,
		data,
	};
	const response = await chatHistory.add(request.podcastId, message);

	return response;
};
```

## Generating an image for the episode

https://developers.cloudflare.com/workers-ai/models/stable-diffusion-xl-lightning/

```typescript
export const handlePodcastGenerateImage = async (req: GenerateImageRequest): Promise<IFunctionResponse | IFunctionResponse[]> => {
	const { request, env, user } = req;

	if (!request.podcastId) {
		return {
			status: 'error',
			content: 'Missing podcast id',
		};
	}

	const chatHistory = ChatHistory.getInstance(env.CHAT_HISTORY);
	const chat = await chatHistory.get(request.podcastId);

	if (!chat?.length) {
		return {
			status: 'error',
			content: 'Podcast not found',
		};
	}

	const summaryData = chat.find((message) => message.name === 'podcast_summarise');

	if (!summaryData?.content) {
		return {
			status: 'error',
			content: 'Podcast summary not found',
		};
	}

	const summary = `I need a featured image for my latest podcast episode, this is the summary: ${summaryData.content}`;

	const data = await env.AI.run(
		'@cf/bytedance/stable-diffusion-xl-lightning',
		{
			prompt: summary,
		},
		{
			gateway: {
				id: gatewayId,
				skipCache: false,
				cacheTtl: 3360,
				metadata: {
					email: user?.email,
				},
			},
		}
	);

	if (!data) {
		return {
			status: 'error',
			content: 'Image not generated',
		};
	}

	const itemId = Math.random().toString(36);
	const imageKey = `podcasts/${itemId}/featured.png`;

	const reader = data.getReader();
	const chunks = [];
	let done, value;
	while ((({ done, value } = await reader.read()), !done)) {
		chunks.push(value);
	}
	const arrayBuffer = new Uint8Array(chunks.reduce((acc, chunk) => acc.concat(Array.from(chunk)), [])).buffer;
	const length = arrayBuffer.byteLength;

	await env.ASSETS_BUCKET.put(imageKey, arrayBuffer, {
		contentType: 'image/png',
		contentLength: length,
	});

	const message = {
		role: 'assistant',
		name: 'podcast_generate_image',
		content: `Podcast Featured Image Uploaded: [${itemId}](https://assistant-assets.nickgriffin.uk/${imageKey})`,
		data,
	};
	const response = await chatHistory.add(request.podcastId, message);

	return response;
};
```

## Linking it all together

