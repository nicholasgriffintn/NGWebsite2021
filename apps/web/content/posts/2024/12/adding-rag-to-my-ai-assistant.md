---
title: 'Adding RAG to my AI assistant'
date: '2024-12-08T18:42'
tags: [ai, cloudflare, cloudflare-ai, rag, vectorize]
description: I've been working on enhancing my AI assistant for a while now, ready to use as a basis for a bigger project that I'm working on, while creating an assistant for myself.\n\nOne of the features that I wanted to add was the ability to use RAG, or Retrieval Augmented Generation, which is what I'll be writing about in this blog post.
image: /uploads/adding-rag-to-my-ai-assistant/featured.png
imageAlt: A screenshot of the AI assistant with RAG enabled.
hideFeaturedImage: true
---

## What is RAG?

To start, it's probably best to explain what RAG is.

RAG of Retrieval-Augmented Generation is the process of providing a large language model with context from an external knowledge base, providing it with additional information outside of its training data.

Even though many LLMs are already trained on vase amounts of data and have a range of knowledge across topics, they don't have the ability to access real-time information or specific information about other topics. RAG solves this problem.

Alongside that, RAG can also help improve the accuracy of responses by providing the LLM with more relevant information.

## Building a Knowledge Base

To start, we need to create some functionality that will allow us to store and retrieve information from a knowledge base.

For this implementation, I'm going to be using [Cloudflare D1](https://developers.cloudflare.com/d1/) to store the data in the database alongside [Cloudflare Vectorize](https://developers.cloudflare.com/vectorize/) to store the vector embeddings of the data, which will be generated with the `@cf/baai/bge-base-en-v1.5` model.

To kick things off, I created a new embedding factory:

```typescript
export class Embedding {
	private static instance: Embedding;
	private provider: EmbeddingProvider;
	private env: IEnv;

	private constructor(env: IEnv) {
		this.env = env;

		this.provider = EmbeddingProviderFactory.getProvider('vectorize', {
			ai: this.env.AI,
			db: this.env.DB,
			vector_db: this.env.VECTOR_DB,
		});
	}

	public static getInstance(env: any): Embedding {
		if (!Embedding.instance) {
			Embedding.instance = new Embedding(env);
		}
		return Embedding.instance;
	}

  ...
}
```

This is a simple Singleton class that allows us to expand the functionality to other providers in the future.

Alongside this, we need to create a new provider for the Cloudflare services, this will be responsible for generating the vector embeddings and storing them in the database.

```typescript
export class VectorizeEmbeddingProvider implements EmbeddingProvider {
	private ai: any;
	private vector_db: Vectorize;
	private db: D1Database;
	private topK: number = 15;
	private returnValues: boolean = false;
	private returnMetadata: 'none' | 'indexed' | 'all' = 'none';

	constructor(config: VectorizeEmbeddingProviderConfig) {
		this.ai = config.ai;
		this.db = config.db;
		this.vector_db = config.vector_db;
	}

	...
}
```

We pass our Cloudflare services to this alongside some other configuration options, such as the top K results we want to return and whether we want to return the metadata from the vector database.

To generate the vector embeddings, we can use the `generate` method:

```typescript
...
async generate(type: string, content: string, id: string, metadata: Record<string, any>): Promise<VectorizeVector[]> {
		try {
			if (!type || !content || !id) {
				throw new AppError('Missing type, content or id from request', 400);
			}

			const response = await this.ai.run(
				'@cf/baai/bge-base-en-v1.5',
				{ text: [content] },
				{
					gateway: {
						id: gatewayId,
						skipCache: false,
						cacheTtl: 172800,
					},
				}
			);

			if (!response.data) {
				throw new AppError('No data returned from Vectorize API', 500);
			}

			const mergedMetadata = { ...metadata, type };

			return response.data.map((vector: any) => ({
				id,
				values: vector,
				metadata: mergedMetadata,
			}));
		} catch (error) {
			console.error('Vectorize Embedding API error:', error);
			throw error;
		}
	}
  ...
}
```

This method will take the content, generate the vector embeddings and return them as an array of objects for the next method, `insert`, which will call the `upsert` method from the Cloudflare Vectorize SDK to store the embeddings in the database.

```typescript
  ...
  async insert(embeddings: VectorizeVector[]): Promise<VectorizeAsyncMutation> {
		const response = await this.vector_db.upsert(embeddings);
		return response;
	}
  ...
```

This all joins up into a new function, [`insertEmbedding`](https://github.com/nicholasgriffintn/assistant/blob/main/src/services/apps/insert-embedding.ts), which we will either call directly via an API or through the AI assistant using a [function call](https://github.com/nicholasgriffintn/assistant/blob/main/src/services/functions/create_note.ts).

```typescript
    ...
		const uniqueId = id || `${Date.now()}-${Math.random().toString(36).substring(2, 15)}`;

		const database = await env.DB.prepare('INSERT INTO documents (id, metadata, title, content, type) VALUES (?1, ?2, ?3, ?4, ?5)').bind(
			uniqueId,
			JSON.stringify(newMetadata),
			title,
			content,
			type
		);
		const result = await database.run();

		if (!result.success) {
			throw new AppError('Error storing embedding in the database', 400);
		}

		const generated = await embedding.generate(type, content, uniqueId, newMetadata);
		const inserted = await embedding.insert(generated);
    ...
```

## Retrieving the Knowledge Base

Now that we have the data stored, we're ready to retrieve it.

To do this, I created a new `searchSimilar` method in the `VectorizeEmbeddingProvider`:

```typescript
...
async searchSimilar(
		query: string,
		options: {
			topK?: number;
			scoreThreshold?: number;
		} = {}
	) {
		const queryVector = await this.getQuery(query);

		if (!queryVector.data) {
			throw new AppError('No embedding data found', 400);
		}

		const matchesResponse = await this.getMatches(queryVector.data[0]);

		if (!matchesResponse.matches) {
			throw new AppError('No matches found', 400);
		}

		const filteredMatches = matchesResponse.matches
			.filter((match) => match.score >= (options.scoreThreshold || 0))
			.slice(0, options.topK || 3);

		const matchesWithContent = await Promise.all(
			filteredMatches.map(async (match) => {
				const record = await this.db.prepare('SELECT metadata, type, title, content FROM documents WHERE id = ?1').bind(match.id).first();

				return {
					title: record?.title as string,
					content: record?.content as string,
					metadata: record?.metadata || match.metadata || {},
					score: match.score || 0,
					type: (record?.type as string) || (match.metadata?.type as string),
				};
			})
		);

		return matchesWithContent;
	}
  ...
```

First this gets the query vector:

```typescript
    ...
    	async getQuery(query: string): Promise<VectorizeVector> {
		return this.ai.run(
			'@cf/baai/bge-base-en-v1.5',
			{ text: [query] },
			{
				gateway: {
					id: gatewayId,
					skipCache: false,
					cacheTtl: 172800,
				},
			}
		);
	}
  ...
```

It then gets the matches from the vector database:

```typescript
    ...
    async getMatches(queryVector: VectorFloatArray) {
      const matches = await this.vector_db.query(queryVector, {
        topK: this.topK,
        returnValues: this.returnValues,
        returnMetadata: this.returnMetadata,
      });

      return matches;
	}
  ...
```

Then it filters the matches based on the score threshold and top K options, before finally returning the matches with the content from the database.

You can find this full implementation [here](https://github.com/nicholasgriffintn/assistant/tree/main/src/lib/embedding).

## Using the Knowledge Base

And that's basically all that needs to be done to get the initial setup done.

The last step is to add functionality to our [createChat](https://github.com/nicholasgriffintn/assistant/blob/main/src/services/createChat.ts) service that will use the `searchSimilar` method to retrieve the knowledge base when the `useRAG` option is enabled.

To do this, we need to augment the input that the user sent with the retrieved knowledge base results.

```typescript
...
	let prompt = request.input;
	if (typeof prompt === 'object') {
		prompt = prompt.prompt;
	}

	if (request.useRAG === true) {
		prompt = await embedding.augmentPrompt(prompt, request.ragOptions);
	}

	messageContent.push({
		type: 'text',
		text: prompt,
	});
...
```

`augmentPrompt` is a method that will take the user's input and augment it with the retrieved knowledge base results.

```typescript
...
	async augmentPrompt(query: string, options?: RagOptions): Promise<string> {
		try {
			const relevantDocs = await this.searchSimilar(query, {
				topK: options?.topK || 3,
				scoreThreshold: options?.scoreThreshold || 0.7,
			});

			if (!relevantDocs.length) {
				return query;
			}

			const shouldIncludeMetadata = options?.includeMetadata ?? true;
			const metadata = shouldIncludeMetadata ? { title: true, type: true, score: true } : {};

			const prompt = `Context information is below.
---------------------
${relevantDocs
	.map((doc) => {
		const parts = [];
		if (metadata.type && doc.type) parts.push(`[${doc.type.toUpperCase()}]`);
		if (metadata.title && doc.title) parts.push(doc.title);

		return `
${parts.join(' ')}
${doc.content}
${metadata.score ? `Score: ${(doc.score * 100).toFixed(1)}%` : ''}
`.trim();
	})
	.join('\n\n')}
---------------------
Given the context information and not prior knowledge, answer the query: ${query}`.trim();

			return prompt;
		} catch (error) {
			console.error(error);
			return query;
		}
	}
...
```

The basically adds on a wrapper around the user's input that includes the retrieved knowledge base results.

I also added on some options here that allows for the user to control what metadata is included in the prompt, this allows the user to reduce the amount of context that is included in the prompt.

And now we have RAG implemented with all of the models that my AI assistant supports.

## Next Steps

- I would like to look into other services that could be used to store the knowledge base. In particular, I'd like to look into [Bedrock Knowledge Bases](https://aws.amazon.com/bedrock/knowledge-bases/) as this is what I'd be using in other projects, I've also heard good things about [Pinecone](https://www.pinecone.io/) and [Chroma](https://www.trychroma.com/) is particularly interesting given it's open source.
- Currently, we only have the ability to add notes to our knowledge base, it would be good to expand this to the blog posts and other content from this website.
- It would also be good to be able to use document attachments and I'd like to look into gathering information from links sent in a chat, but this will be quite a bit of work.
- The assistant could do with some restructuring now that it is a little more complex.
