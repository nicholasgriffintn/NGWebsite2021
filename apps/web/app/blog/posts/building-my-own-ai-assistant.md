---
title: "Building My Own AI Assistant"
description: "Like many people, I've been using tools like ChatGPT for some time now and they're great, however, they lock you down to a third party service that you need to pay monthly for to get a good service and they aren't as fun given that you can't really customise them. With this project, I'm going to build my own using Cloudflare AI. It will be capable of full conversations alongside being able to query for external data."
date: "2024-11-10"
updated: "2024-11-11"
image: "/uploads/building-my-own-ai-assistant/featured.png"
imageAlt: "A screenshot of the chat interface that I built for my AI assistant"
hideFeaturedImage: true
---

> If you'd like to skip straight to the code, you can find it [here](https://github.com/nicholasgriffintn/assistant).

To get started, we first need to setup a Cloudflare Worker, this is a simple process, you can follow the guide [here](https://developers.cloudflare.com/workers/quickstart).

You just need to run the following command:

```bash
npx wrangler init
```

And then enter the details for your project. For this one, I'll be using the basic hello world template with TypeScript.

Alongside that, we'll be using a web framework called [hono](https://hono.dev/) which is a lightweight framework that's built on Web Standards, making it great for a serverless implementation.

We just need to run `pnpm install hono` to get this set up.

## Creating a basic homepage

Now that's done, from the `src/index.ts` file, we can add a simple route:

```typescript
import { Hono } from 'hono';

const app = new Hono();

app.get('/', (context) => {
	return context.html(`
		<html>
			<head>
				<title>Nicholas Griffin's Personal Assistant</title>
			</head>
			<body>Hello! Sorry, not much to see here yet.</body>
		</html>
	`);
});

export default app;
```

This will create a simple homepage that just says hello.

## Adding a chat route

Next I'm going to be adding a new chat route, this will take an input from the user and then return the response from Cloudflare AI.

This will be a simple post route, we'll be kicking off with this:

```typescript
app.post('/chat', async (context) => {
	try {
    return context.json({
      response: 'Not implemented yet',
    });
	} catch (error) {
		console.error(error);

		return context.json({
			response: 'Something went wrong, we are working on it',
		});
	}
});
```

Next up, I want to start by ensuring that an access token is provided, this will ensure that no one uses our endpoint if they don't have the key, I'll be doing this through environment variables, which isn't the best possible way, but it's starts us off on the right path.

To do this, I'll get the token from the environment and then check it against one provided either in the headers or the query (we'll be using query strings later for an integration with Siri Shortcuts).

```typescript
app.post('/chat', async (context) => {
  ...
		if (!context.env.ACCESS_TOKEN) {
			return context.json({
				response: 'Missing ACCESS_TOKEN binding',
				status: 400,
			});
		}

		const authFromQuery = context.req.query('token');
		const authFromHeaders = context.req.headers.get('Authorization');
		const authToken = authFromQuery || authFromHeaders?.split('Bearer ')[1];

		if (authToken !== context.env.ACCESS_TOKEN) {
			return context.json({
				response: 'Unauthorized',
				status: 403,
			});
		}
  ...
});
```

Then we're going to call a service which will handle the AI request and return the response, for now this will call a new service function called `handleChat`.
  
```typescript
import type { IBody } from './types';
import { handleChat } from './services/chat';

app.post('/chat', async (context) => {
  ...
		const body = (await context.req.json()) as IBody;

		const response = await handleChat({
			env: context.env,
			request: body,
		});

		return context.json({
			response,
		});
  ...
});
```

## Building a conversational chat service

Now we need to build the `handleChat` function, this will be a simple function that will take the input from the user and then return the response from the AI.

To do this, we're going to need something to store the conversation state, for this project, I'm going to be using [Cloudflare KV](https://developers.cloudflare.com/kv/), which is a key-value store that is available to Workers, it's pretty simple to use as it works over Bindings.

To create a new store, we just need to run `npx wrangler kv:namespace create assistant_chats` for the production namespace and `npx wrangler kv:namespace create assistant_chats --preview` for the preview namespace.

Note down the IDs from both of these and then add them to the `wrangler.toml` file like so:

```toml
kv_namespaces = [
  {binding = "assistant_chats",id = "<id>",preview_id = "<preview_id>"}
]
```

Then we're going to create a basic class that will make it easier to interact with the KV store and manage the state:

```typescript
type Message = {
	role: string;
	content: string;
};

export class ChatHistory {
	private static instance: ChatHistory;
	private kvNamespace: KVNamespace;

	private constructor(kvNamespace: KVNamespace) {
		this.kvNamespace = kvNamespace;
	}

	public static getInstance(kvNamespace: KVNamespace): ChatHistory {
		if (!ChatHistory.instance) {
			ChatHistory.instance = new ChatHistory(kvNamespace);
		}
		return ChatHistory.instance;
	}

	async add(chatId: string, message: Message): Promise<void> {
		const chat = await this.kvNamespace.get(chatId);
		let messages: Message[] = [];

		if (chat) {
			const parsedChat = JSON.parse(chat);
			if (Array.isArray(parsedChat)) {
				messages = parsedChat;
			}
		}

		messages.push(message);
		await this.kvNamespace.put(chatId, JSON.stringify(messages));
	}

	async get(chatId: string): Promise<Message[]> {
		const chat = await this.kvNamespace.get(chatId);
		if (!chat) {
			return [];
		}
		return JSON.parse(chat);
	}
}
```

This provides a couple of methods, `add` and `get`, which will allow us to add messages to the chat and then retrieve them.

Next we need to create a prompts library that will return system prompts with context for the chat from the body provided, this looks like this:
  
```typescript
export function chatSystemPrompt(request: IBody): string {
	return `
    You are a personal assistant designed to help the user with their daily tasks.
    Answer the user's questions in 1 or 2 sentences. Be concise and specific while remaining friendly and helpful.
    You should do your best to keep the conversation as short as possible, but don't be afraid to ask for more information if you need it.
    Only answer questions that you are confident in, and don't be afraid to say "I don't know" if you don't know the answer.
    If you are unsure about the user's question, ask for clarification.
    Only answer in text, don't return computer code.
  
    Here's some additional context:
    - Today's date: ${request.date}
    ${request.location && `- User's location: Latitude ${request.location.latitude}, Longitude ${request.location.longitude}`}
    `;
}
```

This is a pretty basic prompt for now that just aims to make sure the AI returns a simple response that's actually helpful and doesn't attempt to make stuff up (hopefully), we'll probably expand on this later.

It also provides context to the AI about the user's location and the date.

I also want to be able to support passing a model of my choosing in the request, allowing me to switch between a number of models through an interface.

```typescript
import type { Model } from '../types';

export function getMatchingModel(model?: Model) {
	switch (model) {
		case 'llama-3.2-3b-instruct':
			return '@cf/meta/llama-3.2-3b-instruct';
		case 'llama-3.1-70b-instruct':
			return '@cf/meta/llama-3.1-70b-instruct';
		case 'hermes-2-pro-mistral-7b':
			return '@hf/nousresearch/hermes-2-pro-mistral-7b';
		default:
			return '@hf/nousresearch/hermes-2-pro-mistral-7b';
	}
}
```

This is just a simple switch statement that will return the model that I want to use based on the input provided. For now, I've just added a few models to experiment with.

Now we're ready to build the `handleChat` function, this will take the input from the user and then return the response from the AI.

```typescript
export const handleChat = async (req: IRequest): Promise<string> => {
	const { request, env } = req;

	if (!request.chat_id || !request.input) {
		throw new Error('Missing chat_id or input');
	}

	if (!env.CHAT_HISTORY) {
		throw new Error('Missing CHAT_HISTORY binding');
	}

  ...
};
```

To start we take the details from the request and then check that the chat ID and input are provided, if they aren't we throw an error.

If that's all good, we then need to get the chat history and system prompt from the functions we created earlier.

```typescript
export const handleChat = async (req: IRequest): Promise<string> => {
  ...
	const chatHistory = ChatHistory.getInstance(env.CHAT_HISTORY);
  await chatHistory.add(request.chat_id, {
		role: 'user',
		content: request.input,
	});

	const systemPrompt = chatSystemPrompt(request);

	const userMessages = await chatHistory.get(request.chat_id);
};
```

Then we just need to add these to our messages array and return the response.

```typescript
export const handleChat = async (req: IRequest): Promise<string> => {
  ...
	if (userMessages.length < 0) {
		throw new Error('No messages found');
	}

	const messages = [
		{
			role: 'system',
			content: systemPrompt,
		},
		...userMessages,
	];
};
```

Then it's just a case of passing this to the AI and returning the response.

```typescript
export const handleChat = async (req: IRequest): Promise<string> => {
  ...
	const model = getMatchingModel(request.model);

	if (!model) {
		throw new Error('Invalid model');
	}

	const modelResponse = await env.AI.run(
		model,
		{ messages },
		{
			gateway: {
				id: 'llm-assistant',
				skipCache: false,
				cacheTtl: 3360,
			},
		}
	);

	if (!modelResponse.response) {
		throw new Error('No response from model');
	}

	return modelResponse.response;
};
```

As you might be able to tell, I'm also using [Cloudflare AI Gateway](https://developers.cloudflare.com/ai-gateway/) here.

This is a great service that provides a proxy of sorts in front of the Cloudflare AI service (or any other service that it supports).

It provides analytics and logging, alongside the ability to cache requests, set rate limits and even fallback or retry requests.

## Running the service

Now we should be able to run the service locally, which we can do with the command `npx wrangler dev src/index.ts`, in my project, I've added this as a script in the `package.json` file so I can just run `pnpm dev`.

This will start the server on `http://localhost:8787`.

Now we can test the chat route by sending a POST request to `http://localhost:8787/chat` with the following body:

```json
{
  "chat_id": "test",
  "input": "Hello, how are you?",
  "date": "2024-11-10",
  "location": {
    "latitude": 51.5074,
    "longitude": 0.1278
  }
}
```

I've also added a Bruno output [here](https://github.com/nicholasgriffintn/assistant/tree/main/docs/api) that you can use to test the service.

Once you've sent that, the request from the AI should be returned, if the same chat_id is used, the AI should be able to continue the conversation, this can be changed by changing the chat_id.

## Adding functions

Earlier this year, Cloudflare added [embedded function calling](https://blog.cloudflare.com/embedded-function-calling/) to Workers, which allows you to call functions from the AI in order to get data from external services.

The interesting part about this vs traditional function calling is that it co-locates the LLM inference with the function execution.

Here's a look at how it works from the Cloudflare blog:

![Embedded function calling](https://cf-assets.www.cloudflare.com/zkvhlag99gkb/15yHmiG9OmRj9KkuLHteRm/2c50ad90b4736fbc7496a8495d58e1fe/image1-23.png)

In comparison, traditional function calling would look like this:

![Traditional function calling](https://cf-assets.www.cloudflare.com/zkvhlag99gkb/2vZ1PHwC5e6RUkxQRKfBW0/1812907a22283b5eef02e92c747e8a73/image3-15.png)

I've not tried this out yet, so I think that I'd give it a go here.

### A function to get the weather

I think a good first function to try this out would be one to get the weather as that should be not too hard to implement and allow us to set up an initial structure.

To get started, we need to install the Cloudflare ai utils package with `pnpm add @cloudflare/ai-utils`.

I'm also going to be using the [OpenWeatherMap API](https://openweathermap.org/api) to get the weather data, so you'll need to sign up for an account and get an API key.

Then we need to set that as a secret with this command (it'll prompt you for the key):

```bash
npx wrangler secret put OPENWEATHERMAP_API_KEY
```

Then we just need to create a weather library that can be used by the AI function to get the weather data.

```typescript
import { IWeather } from '../types';

export const getWeatherForLocation = async (env: any, location: { latitude: number; longitude: number }): Promise<string> => {
	try {
		if (!env.OPENWEATHERMAP_API_KEY) {
			throw new Error('Missing OPENWEATHERMAP_API_KEY variable');
		}

		const baseUrl = 'https://api.openweathermap.org/data/2.5/weather';
		const url = `${baseUrl}?lat=${location.latitude}&lon=${location.longitude}&units=metric&appid=${env.OPENWEATHERMAP_API_KEY}`;

		const weatherResponse = await fetch(url);

		if (!weatherResponse.ok) {
			throw new Error('Error fetching weather data');
		}

		const weatherData: IWeather = await weatherResponse.json();

		if (weatherData.cod !== 200) {
			return "Sorry, I couldn't find the weather for that location";
		}

		return `The weather in ${weatherData.name} is ${weatherData.weather[0].description} with a temperature of ${weatherData.main.temp}°C`;
	} catch (error) {
		console.error(error);
		return '';
	}
};
```

Note that we always want to return a string from the function so that we get a good response from the AI.

Then we need to create a function that will be called by the AI to get the weather data, this needs to follow the OpenAI function format.

```typescript
import { getWeatherForLocation } from '../lib/weather';
import { IFunction, IRequest } from '../types';

export const get_weather: IFunction = {
	name: 'get_weather',
	description: 'Get the current weather for a location',
	parameters: {
		type: 'object',
		properties: {
			longitude: {
				type: 'number',
				description: 'The longitude to get the weather for',
			},
			latitude: {
				type: 'number',
				description: 'The latitude to get the weather for',
			},
		},
	},
	function: async (args: any, req: IRequest) => {
		const location = { longitude: args.longitude, latitude: args.latitude };

		if (!location.longitude || !location.latitude) {
			throw new Error('Missing longitude or latitude');
		}

		return await getWeatherForLocation(req.env, location);
	},
};
```

Then we need to update our original `handleChat` function to call this function if the model supports function calling.

> Note that currently only the `hermes-2-pro-mistral-7b` model supports function calling. You can find the full list of models that support function calling [here](https://developers.cloudflare.com/ai-gateway/models), it will probably change in the future.

```typescript
import { availableFunctions } from './functions';

export const handleChat = async (req: IRequest): Promise<string> => {
  ...
	const supportsFunctions = model === '@hf/nousresearch/hermes-2-pro-mistral-7b';

	const modelResponse = await env.AI.run(
		model,
		{
			messages,
			tools: supportsFunctions ? availableFunctions : undefined,
		},
		{
			gateway: {
				id: 'llm-assistant',
				skipCache: false,
				cacheTtl: 3360,
			},
		}
	);
  ...
};
```

THis imports a new variable called `availableFunctions`, this is an array of functions in a new service that I created called `functions`.

```typescript
import type { IRequest, IFunction } from '../types';
import { get_weather } from '../functions/weather';

export const availableFunctions: IFunction[] = [get_weather];

export const handleFunctions = async (functionName: string, args: unknown, request: IRequest): Promise<string> => {
	const foundFunction = availableFunctions.find((func) => func.function.name === functionName);
	if (!foundFunction) {
		return '';
	}
	return foundFunction.function(args, request);
};
```

This also has a method called `handleFunctions`, when the AI responds with a function call, this is for traditional function calling, which is a bit different to embedded function calling.

In most cases, we'll be using embedded and when we do use that, we won't need to do anything else, for traditional, the model will return a list of `tool_calls` like this:

```json
{
  "name": "get_weather",
  "arguments": {
    "latitude": 51.5074,
    "longitude": 0.1278
  }
}
```

We need to be able to handle this in the `handleChat` function, like so:

```typescript
import { availableFunctions, handleFunctions } from './functions';

export const handleChat = async (req: IRequest): Promise<string> => {
  ...
	if (modelResponse.tool_calls) {
		chatHistory.add(request.chat_id, {
			role: 'assistant',
			name: 'External Functions',
			tool_calls: modelResponse.tool_calls,
		});

		const functionResults = [];

		for (const toolCall of modelResponse.tool_calls) {
			try {
				const result = await handleFunctions(toolCall.name, toolCall.arguments, req);

				functionResults.push(result);

				await chatHistory.add(request.chat_id, {
					role: 'assistant',
					name: toolCall.name,
					content: result,
				});
			} catch (e) {
				console.error(e);
				throw new Error('Error handling function');
			}
		}

		return functionResults.join('\n');
	}
  ...
};
```

## Building the frontend

Now we need some sort of frontend to make this all work.

I didn't really want tot spend too much time on this as it's only going to be for me and honestly, I don't think that's really the interesting part, but if you'd like to see what I did, you can find the code [here](https://github.com/nicholasgriffintn/website/blob/main/apps/web/app/chat/page.tsx).

It looks like this:

![A screenshot of the chat interface that I built for my AI assistant](/uploads/building-my-own-ai-assistant/featured.png)

It's pretty basic right now.

On the left we have a sidebar which shows the conversation history, this is retrieved from an api route that I added to the worker which will return a list of the keys from the KV store.

On the right we have the chat interface, this is where the user can input their message and then see the response from the AI, this gets messages from another API route and then adds new one as the user sends messages or the AI responds.

## Next steps

This is just the start of the project, there's a few more bits that I can do, such as:

- Expanding the capabilities with more functions
- Adding in other useful services like code suggestions or image generation / recognition.
- I also think a summarisation service for YouTube and articles would be useful.

I might not write about these, but if they do end up interesting, I might do.

Until then, you can find the code for this project [here](https://github.com/nicholasgriffintn/assistant).