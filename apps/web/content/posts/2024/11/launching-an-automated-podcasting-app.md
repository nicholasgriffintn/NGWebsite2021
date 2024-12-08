---
title: Launching an Automated Podcasting App
description: Recently I created a new podcasting app that is able to automatically generate a podcast listing from an audio upload, including generating a transcript, speaker identification, and more.
date: 2024-11-24
image: /uploads/launching-an-automated-podcast-app/identify_speakers.png
imageAlt: A screenshot of a part of th frontend for the AI podcasting app, showing the stage where the user is displayed a sample of the transcription and asked to identify the speakers.
hideFeaturedImage: true
tags: [ai, podcasting, cloudflare, r2, replicate, whisper, bart, stable-diffusion-xl-lightning]
---

Previously, I started work on building an AI based assistant [that you can read about here](/blog/building-my-own-ai-assistant), as time goes on, I plan to expand this with mini applications that the user can open from the assistant and use to complete certain tasks.

One of the first of these is what I'm writing about today, an automated podcasting app. The app is able to automatically generate a podcast listing from an audio upload, including generating a transcript, speaker identification, and more.

## Creating an API to upload audio

To start, I'll need  to create a new API endpoint that can accept an audio file upload and then store that in a bucket.

With Hono, this is just requires adding a new route to our apps route file, like so:

```typescript
app.post('/apps/podcasts/upload', async (context) => {
	try {
		// Get the body from the request
		const body = await context.req.parseBody();

		// Get the user details from the headers (this will be used to track who uploaded the podcast)
		const userEmail: string = context.req.headers.get('x-user-email') || '';
		const user = {
			email: userEmail,
		};

		// Call the function to handle the podcast upload
		const response = await handlePodcastUpload({
			env: context.env as IEnv,
			audio: body['audio'] as Blob,
			user,
		});

		// Return the response
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

The `handlePodcastUpload` function is where most of the functionality is.

This function takes an audio file or a URL to an audio file, generate a new chat in our chat history, and then either provide a signed URL to upload the file to, or if a URL is provided, just return that.

The function looks like this:

```typescript
export const handlePodcastUpload = async (req: UploadRequest): Promise<IPodcastUploadResponse> => {
	const { env, request } = req;

	...

	const podcastId = Math.random().toString(36);
	// Create a new chat in the history with a random ID (this will probably need to be changed to an input later on)
	const chatHistory = ChatHistory.getInstance(env.CHAT_HISTORY);
	await chatHistory.add(podcastId, {
		role: 'user',
		content: 'Generate a podcast record with a transcription',
		app: 'podcasts',
	});

	if (!request.audioUrl) {
		// If no audio URL is provided, we need to generate a signed URL to upload the file to
		const imageKey = `podcasts/${podcastId}/recording.mp3`;
		const bucketName = 'assistant-assets';
		const accountId = env.ACCOUNT_ID;
		// We will be using Cloudflare R2 and the AWS S3 SDK to generate a signed URL
		const url = new URL(`https://${bucketName}.${accountId}.r2.cloudflarestorage.com`);
		url.pathname = imageKey;
		url.searchParams.set('X-Amz-Expires', '3600');
		// Create a new R2 client with the access key and secret key for the bucket
		const r2 = new AwsClient({
			accessKeyId: env.ASSETS_BUCKET_ACCESS_KEY_ID,
			secretAccessKey: env.ASSETS_BUCKET_SECRET_ACCESS_KEY,
		});
		// Sign the request
		const signed = await r2.sign(
			new Request(url, {
				method: 'PUT',
			}),
			{
				aws: { signQuery: true },
			}
		);

		if (!signed) {
			console.error('Failed to sign request');
			return {
				status: 'error',
				content: 'Failed to sign request',
			};
		}

		const message = {
			role: 'assistant',
			content: `Podcast Uploaded: [Listen Here](https://assistant-assets.nickgriffin.uk/${imageKey})`,
			name: 'podcast_upload',
			data: {
				imageKey,
				url,
				signedUrl: signed.url,
			},
		};
		const response = await chatHistory.add(podcastId, message);

		return {
			...response,
			chatId: podcastId,
		};
	}

	// If an audio URL is provided, we can just store and return that
	const message = {
		role: 'assistant',
		content: 'Podcast Uploaded [Listen Here](' + request.audioUrl + ')',
		name: 'podcast_upload',
		data: {
			url: request.audioUrl,
		},
	};
	const response = await chatHistory.add(podcastId, message);

	return {
		...response,
		chatId: podcastId,
	};
};
```

Once returned, if there is a signed URL, it is expected that the frontend will use this to upload the audio file to, I'm using signed URLs here as podcast audio is potentially quite large and because we are using "serverless" functions, it would be costly to keep them open for the duration, they would also timeout.

Also, as you might be able to see, we're using [Cloudflare R2](https://developers.cloudflare.com/r2/) for our storage, this keeps the full system in one place but still allows us to use the S3 SDKs.

## Identifying Speakers and Transcribing Audio

Next up, we need to create another endpoint for transcribing the audio that was provided in the previous step, this is very similar to the previous endpoint, but with a new function, you can find the code for the endpoint [here](https://github.com/nicholasgriffintn/assistant/blob/main/src/routes/apps.ts#L68).

Unfortunately, the Whisper model provided by Cloudflare AI does not have any support for speaker identification, so we need to use a different service.

Thankfully, Cloudflare's AI Gateway does have support for the Replicate service and there's already a model available there that I think could do the job quite well, it's called `whisper-diarization` and made by [Thomas Mol](https://github.com/thomasmol), you can find it [here](https://replicate.com/thomasmol/whisper-diarization).

They've also provided the [source code](https://github.com/thomasmol/cog-whisper-diarization) if you want to take a look at how it works.

```typescript
export const handlePodcastTranscribe = async (req: TranscribeRequest): Promise<IFunctionResponse | IFunctionResponse[]> => {
	const { request, env, user, appUrl } = req;

	...

	// Get the Chat History to find the previous messages
	const chatHistory = ChatHistory.getInstance(env.CHAT_HISTORY);
	const chat = await chatHistory.get(request.podcastId);

	...

	// Find the message with the podcast upload data
	const uploadData = chat.find((message) => message.name === 'podcast_upload');

	...

	// Setting up the request to the Replicate API through AI Gateway
	const baseUrl = getGatewayExternalProviderUrl(env, 'replicate');
	const url = `${baseUrl}/predictions`;
	const headers = {
		Authorization: `Bearer ${env.REPLICATE_API_TOKEN}`,
		'Content-Type': 'application/json',
		Prefer: 'wait=2',
		'cf-aig-metadata': JSON.stringify({
			email: user?.email,
		}),
	};
	// The webhook URL is where the model will send the results
	const baseWebhookUrl = appUrl || 'https:///assistant.nicholasgriffin.workers.dev';
	const webhookUrl = `${baseWebhookUrl}/webhooks/replicate?chatId=${request.podcastId}&token=${env.WEBHOOK_SECRET}`;
	// The body of the request to the model
	const body = {
		version: 'cbd15da9f839c5f932742f86ce7def3a03c22e2b4171d42823e83e314547003f', // This is the version of the model
		input: {
			file: uploadData.data.url,
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
  // Store the response in the chat history
	const message = {
		role: 'assistant',
		name: 'podcast_transcribe',
		content: `Podcast Transcribed: ${data.id}`,
		data,
	};
	const response = await chatHistory.add(request.podcastId, message);

	return response;
};
```

This function is basically just calling an API to trigger the process of transcribing the audio, this can take a little while, so we need to use a Webhook ([documented here](https://replicate.com/docs/topics/webhooks)), Replicate will call this webhook when the transcription is complete, we created the endpoint to handle this previously, [you can find it here](https://github.com/nicholasgriffintn/assistant/blob/main/src/services/webhooks/replicate.ts).

It's going to be expected that the frontend waits from the transcription to be complete before moving on to the next step, they'll do this by polling the [getChat endpoint](https://github.com/nicholasgriffintn/assistant/blob/main/src/services/getChat.ts).

## Summarizing the Transcript

The next feature we want is a summary of the transcription, we want this to generate a description for the podcast that can also be used at a later stage to also generate a featured image.

You can find the [code for this here](https://github.com/nicholasgriffintn/assistant/blob/main/src/services/apps/podcast/summarise.ts).

It's largely similar to what we gone through in the past.

As Replicate is returning a format for transcriptions, we do need to first generate a full transcription from the segments, this is done with the following function:

```typescript
function generateFullTranscription(
	transcription: {
		segments: { speaker: any; text: any }[];
	},
	speakers: {
		[name: string]: string;
	}
) {
	const fullTranscription = transcription.segments
		.map((segment: any) => {
			const speaker = speakers[segment.speaker];
			return `${speaker}: ${segment.text}`;
		})
		.join('\n');

	return fullTranscription;
}
```

Then we pass this in a prompt to the model [bart-large-cnn](https://developers.cloudflare.com/workers-ai/models/bart-large-cnn/), which should generate a summary of the transcription.

```typescript
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
```

## Generating an image for the episode

The final step is to generate an image for the episode, this is similar to other steps, this time we're going to be passing the summary generated in the previous step to the model.

We're going to be using the [stable-diffusion-xl-lightning](https://developers.cloudflare.com/workers-ai/models/stable-diffusion-xl-lightning) model for this as it's able to generate images from text and outputs at 1024px.

It's created by ByteDance (the parent company of TikTok), the main difference is that it's a bit more optimised, which makes it a bit faster than the other stable diffusion models.

```typescript
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
```

## Linking it all together

Now that we have the API, we need to create a frontend for the user to interact with.

I'm not going to put too much effort into this, but you can [find the code for it here](https://github.com/nicholasgriffintn/website/blob/main/apps/web/components/ChatInterface/Sidebar/Apps/PodcastApp/index.tsx).

It's a basic modal that shows a few forms and steps the user through the process, calling each API in turn, here's a screenshot of the transcription step:

![Transcribing frontend step](/uploads/launching-an-automated-podcast-app/transcribing.png).

After the transcribing step, we also need to get the user to confirm the identity of the speakers as if the speakers did not say their name in the audio, the model wouldn't have labelled them in the transcription.

![Identifying users frontend step](/uploads/launching-an-automated-podcast-app/identify_speakers.png).

And then finally, we put the output into the chat interface that we made in the previous post.

![Chat frontend](/uploads/launching-an-automated-podcast-app/podcast_chat.png).

## Next Steps

As you can see, I've not put too much effort into the frontend, if I wanted to make this an all out app it might be something that I would want to expand into something that was a bit more user friendly and feature full.

Ideally, users should be able to move across steps individually and go back, this is possible in the API, but not in the frontend.

And finally, we would want to build out specific chat functionality in the frontend to ensure that when the user chats, the model is specifically prompted to respond based on the podcast and nothing else.

I may do these bits on the side or as part of a future post, maybe for another AI app.

