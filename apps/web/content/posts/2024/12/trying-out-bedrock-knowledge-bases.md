---
title: 'Trying out Bedrock Knowledge Bases'
date: '2024-12-09T23:02'
tags: [ai, rag, bedrock, aws]
description: Earlier this week, I wrote a wrote a post about [adding RAG to my AI assistant](/blog/adding-rag-to-my-ai-assistant), at the time, I started with Cloudflare Vectorize which I had already used in the past for another project, so it wasn't super difficult. To make things a little more interesting and because I am working on a different project that uses AWS, I wanted to try out Bedrock Knowledge Bases.
image: /uploads/trying-out-bedrock-knowledge-bases/homepage.png
imageAlt: A screenshot of the AWS console showing the Bedrock Knowledge Bases page.
hideFeaturedImage: true
---

Bedrock Knowledge Bases are pretty similar conceptually to Vectorize and a embedding implementation, however, it is closed source and because it is on AWS, it has a few more features that expands its capabilities.

The cool thing about them is that it's a fully manage service, AWS handles all the way from the actual ingestion of content all the way up to storing it. While Amazon's documentation is still lacking in this area and their authentication is confusing, this does make it simpler to use in the long term.

## Getting started

To get started, we need to load up the AWS console and navigate to the Bedrock Knowledge Bases page and then work your way through the setup process.

Once you've created one, you might see a page like this:

![A screenshot of the AWS console showing the Bedrock Knowledge Bases page.](/uploads/trying-out-bedrock-knowledge-bases/homepage.png)

Within this page, you'll see 2 different data sources that I'm going to be using for this implementation. The first is a Web Crawler and the second is a custom source.

For the Web Crawler, I've configured it to crawl my blog section. As it syncs, AWS will navigate to each of the pages in this section, extract the content and then store it in the knowledge base, with vector embeddings.

All this will be accessible via the SDKs and APIs as well as through AWS OpenSearch, which is the vector database that I configured to use.

![A screenshot of the AWS console showing the ability to add a document to a custom source.](/uploads/trying-out-bedrock-knowledge-bases/custom-source-add.png)

Alongside this, I've also created a custom source, this can be used to add documents or text directly to the knowledge base, either via the form you can see in the screenshot above or via the API SDKs.

## Extending my code

Now that this has been setup, it's time to extend the code from Vectorize with the ability to retrieve and insert data from and to the Bedrock Knowledge Bases.

This starts with a new `BedrockEmbeddingProvider`, this is similar to the Vectorize provider, but maintains a similar structure to make the implementation easier.

```typescript
export class BedrockEmbeddingProvider implements EmbeddingProvider {
    // Implements the same methods as VectorizeEmbeddingProvider
    async generate(type: string, content: string, id: string, metadata: Record<string, any>) {
        // Bedrock-specific implementation
    }

    async insert(embeddings: EmbeddingVector[]) {
        // Bedrock's document insertion logic
    }

    async getMatches(queryVector: string) {
        // Retrieve similar embeddings from Bedrock Knowledge Base
    }
}
```

### Authentication

The somewhat complex part of this is the authentication.

Unlike Vectorize where the service is accessible via bindings, we need to configure AWS credentials and then sign URLs in order to access the service.

To do this, I'm using the `aws4fetch` library, which is a wrapper around the normal SDK, but for fetch based environments, like Cloudflare Workers.

Here's an example of how I've implemented this:

```typescript
constructor(config: BedrockEmbeddingProviderConfig) {
		this.knowledgeBaseId = config.knowledgeBaseId;
		this.knowledgeBaseCustomDataSourceId =
			config.knowledgeBaseCustomDataSourceId;
		this.region = config.region || "us-east-1";
		this.agentEndpoint = `https://bedrock-agent.${this.region}.amazonaws.com`;
		this.agentRuntimeEndpoint = `https://bedrock-agent-runtime.${this.region}.amazonaws.com`;

    this.aws = new AwsClient({
        accessKeyId: config.accessKeyId,
        secretAccessKey: config.secretAccessKey,
        region: this.region,
        service: "bedrock",
    });
}
```

This is then used to sign requests like so:

```typescript
const response = await this.aws.fetch(url, {
  method: "PUT",
  headers: {
    "Content-Type": "application/json",
  },
  body,
});
```

### Inserting records

To insert records, I updated the `insert` method, like so:

```typescript
async insert(
  embeddings: EmbeddingVector[],
): Promise<EmbeddingMutationResult> {
  const url = `${this.agentEndpoint}/knowledgebases/${this.knowledgeBaseId}/datasources/${this.knowledgeBaseCustomDataSourceId}/documents`;

  const body = JSON.stringify({
    documents: embeddings.map((embedding) => ({
      content: {
        dataSourceType: "CUSTOM",
        custom: {
          customDocumentIdentifier: {
            id: embedding.id,
          },
          sourceType: "IN_LINE",
          inlineContent: {
            type: "TEXT",
            textContent: {
              data: embedding.metadata.content || "",
            },
          },
        },
      },
      metadata: {
        type: "IN_LINE_ATTRIBUTE",
        inlineAttributes: Object.keys(embedding.metadata).map((key) => ({
          key,
          value: {
            type: "STRING",
            stringValue: embedding.metadata[key],
          },
        })),
      },
    })),
  });
```

You can find the structure for this in the [Bedrock documentation](https://docs.aws.amazon.com/bedrock/latest/APIReference/API_agent_IngestKnowledgeBaseDocuments.html).

To note, this is only allowing for text content to be added at the moment.

I have it on my list of things to work out document uploads in the future.

### Retrieving records

To retrieve records, I updated the `getMatches` method, like so:

```typescript
async getMatches(queryVector: string) {
  const url = `${this.agentRuntimeEndpoint}/knowledgebases/${this.knowledgeBaseId}/retrieve`;
  
  const body = JSON.stringify({
      retrievalQuery: { text: queryVector }
  });

  const response = await this.aws.fetch(url, {
    method: "POST",
    headers: {
      "Content-Type": "application/json",
    },
    body,
  });

  const data = await response.json();

		return {
			matches: data.retrievalResults.map((result: any) => ({
        title: result.title || "",
        content: result.content.text || "",
        id: result.location?.type || "",
        score: result.score || 0,
        metadata: {
          ...result.metadata,
          location: result.location,
        },
      })),
			count: data.retrievalResults.length,
		};
}
```

To note here, we're returning a pre defined structure here to match Vectorize rather than the full details, there is quick a lot more information available in the response.

Here's what this looks like:

```json
{
  "response": {
    "status": "success",
    "data": [
      {
        "content": "In particular, I'd like to look into Bedrock Knowledge Bases](https://aws.amazon.com/bedrock/knowledge-bases/) as this is what I'd be using in other projects, I've also heard good things about [Pinecone](https://www.pinecone.io/) and [Chroma is particularly interesting given it's open source. * Currently, we only have the ability to add notes to our knowledge base, it would be good to expand this to the blog posts and other content from this website. * It would also be good to be able to use document attachments and I'd like to look into gathering information from links sent in a chat, but this will be quite a bit of work. * The assistant could do with some restructuring now that it is a little more complex.",
        "metadata": {
          "x-amz-bedrock-kb-source-uri": "https://nicholasgriffin.dev/blog/adding-rag-to-my-ai-assistant",
          "x-amz-bedrock-kb-chunk-id": "1%3A0%3AIAWlqJMBAQB7Ydyq-Kxe",
          "x-amz-bedrock-kb-data-source-id": "NTSYRVWLV2",
          "location": {
            "type": "WEB",
            "webLocation": {
              "url": "https://nicholasgriffin.dev/blog/adding-rag-to-my-ai-assistant"
            }
          }
        },
        "score": 0.5003925,
        "type": "text"
      },
      ...
    ]
  }
}
```

This is a bit easier to understand, you can find the structure for this in the [Bedrock documentation](https://docs.aws.amazon.com/bedrock/latest/APIReference/API_agent-runtime_Retrieve.html).

## Next steps

I think that's mostly the implementation honestly, outside of adding document uploads, I think this is mostly done.

However, if I was doing it for a big project, I would probably look into the following:

- Adding some caching to the retrieval process
- Monitoring the service with logs and dashboards
- Getting more use out of OpenSearch
