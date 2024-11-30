---
title: "Using Cloudflare AI for Vectorizing RSS Feeds with LLMs"
description: "The "llm-rss-vectorise-agent" project explores the power of large language models (LLMs) combined with Cloudflare’s edge infrastructure to analyze, vectorize, and process RSS feed content. This post takes you through my experience of using it for this project and how I think AI works in this context."
date: "2024-10-25T15:36"
image: "/uploads/using-cloudflare-ai-for-vectorizing-rss-feeds-with-llms/website.png"
imageAlt: "A screenshot of the website I built for the project, showing the RSS feed content and search functionality."
hideFeaturedImage: true
tags: [cloudflare, ai, rss, vectorize, llm]
---

Back in September 2023, [Cloudflare](https://www.cloudflare.com/en-gb/press-releases/2023/cloudflare-launches-workers-ai-deploy-ai-inference/) launched their new Workers AI platform.

Immediately, the thought of this excited me as it brings the huge power of AI to the everyday user, and I wanted to build something that could leverage this new platform. Since that time, I've been playing around with it for random queries and scripts, but more recently, I decided that I wanted to build something that took advantage of the full stack.

And that's where the ["llm-rss-vectorise-agent" project](https://github.com/nicholasgriffintn/llm-rss-vectorise-agent) comes in.

## What is it?

In summary, the LLM RSS Vectorise Agent is a tool I built that will ingest RSS feed content, vectorise them into Cloudflare's Vectorize database, and then make them searchable using a simple Remix interface (also running on Cloudflare Workers).

Here's a quick video preview:

<video width="800" height="450" controls>
  <source src="https://github.com/user-attachments/assets/a77b4a33-20f9-4601-ba46-39ba798d7c6c" type="video/mp4" />
Your browser does not support the video tag.
</video>

### Structure

The project is split into two main apps:

- Vectorise

The [Vectorise](https://github.com/nicholasgriffintn/llm-rss-vectorise-agent/blob/main/apps/vectorize) app is a [CloudFlare Workers](https://developers.cloudflare.com/workers/) app that has three triggers:

1. `insert` - This is triggered by calling the API URL with the endpoint `/insert`, it retrieves the list of RSS feeds and then queues them for processing.
2. `query` - This is triggered by calling the API URL with the endpoint `/query` and a query string parameter `query`, it will pass the contents of the query to the Cloudflare AI model and return matching results.
3. `queue` - This is triggered by [Cloudflare Queues](https://developers.cloudflare.com/queues/), which will send messages from the insert trigger either to process the RSS feed, or to process entries from the feed, for each entry, it will insert them into the [Vectorize database](https://developers.cloudflare.com/vectorize/) as well as a [Cloudflare D1](https://developers.cloudflare.com/d1/) database.

- Web

This is the [web interface](https://github.com/nicholasgriffintn/llm-rss-vectorise-agent/blob/main/apps/web) for the Vectorise app, it allows you to search the database and view the results.

Alongside that, it provides interfaces for generating summaries of articles as well as a basic analysis of the content for things like sentiment and potential political bias.

It also runs on Cloudflare Workers and is built using [Remix](https://remix.run/).

## Disclosing the use of AI and the potential harms

Now that I've mentioned the use of a few AI tools, I want to make it clear that this project is purely for research purposes and it is important to note that a lot of this technology is very early and can be harmful if used incorrectly.

I've also noted this in the project's footer:

> This application was created for research purposes only, it is not the intention to cause any negative affects to the sites that the systems store or display. If you would like your site removed from the system, please contact me.
>
> Also, when using the AI functionality, please be aware that the services are being provided while in active development. I am using some "beta" level services, investigating some stuff I don't know a lot about and generally trying to work out the best prompts.
>
> DO NOT use the output of the AI to make any decisions, it is provided as research only.

I would suggest doing similar should you build something with AI.

### Scraping of content

Alongside the AI disclosure, it's also important to note that I did some scrapping of content in order to build this project, there was no intention here to replace any of the content that was scraped or cause harm to the sources it was scrapped from.

Once this project was completed, I stopped any of the services that were scraping content and I have no intention of starting them again.

## Why Cloudflare AI?

Now that we've covered the disclosures, let's get started on some of the technical details.

There are a whole range of LLMs and related services out there, so why did Cloudflare's AI tools stand out for me when building this project? Well, there were a few reasons:

- **"Open Source" Models**: For me, the future of AI is with open source models, while they are not fully open source, they are closer to my ideals of AI being open and accessible to the world. Cloudflare's tools are been built to provide access to many of these models.

- **Managed Services**: While I could have used something like [Ollama](https://ollama.com/) for this project, and it is a fantastic tool for running models locally, I wanted something managed. As a side project that I didn't have a whole ton of time to work on, I wanted to focus my time specifically on learning the parts I haven't done yet.

- **Global Scale**: Cloudflare's infrastructure is pretty massive, they have services all over the globe and are able to communicate with users as close to them as possible. This reduces the overall latency and enhances the speed of the service.

- **AI Gateway**: Cloudflare's [AI Gateway](https://developers.cloudflare.com/ai-gateway/) service is brilliant and nothing else is doing this right now. It's a huge reason to choose Cloudflare over anything else - providing analytics, logging, caching, rate limiting and improved resilience with retries and fallback logic.

## How does it all work?

### Processing the RSS feeds

To start, I selected a number of RSS feeds that I wanted to process, these are across a range of topics including technology news from The Verge, poltics and sports from the BBC and The Guardian, the front page of Hacker News and even the BBC's In Pictures feed for a bit of alteration.

When the app is first triggered, it will loop through this list of feeds and queue them for individual processing.

For each RSS feed, the app gets a list of entries, stores the basic metadata into the D1 dataabase and then queues the content for processing in a future stage. I then use cheerio to extract the content from the page and store it, alongside the basic metadata into the D1 database.

I don't strictly need to do the D1 database step but it allows for other future users cases and can be used to reduce the amount that we need to store inside of the Vectorize database.

### Vectorising the content

As part of the processing stage, I generate vectors for the content and then store them in the Vectorize database.

With Cloudflare this is a pretty simple to do through [Workers Bindings](https://developers.cloudflare.com/workers-ai/configuration/bindings/), which allow you to interact with other resources with just a few lines of code, like this for generating the vectors:

```javascript
/**
 * Generates vectors using the AI service.
 *
 * @param env - The environment object containing various services.
 * @param id - The ID of the item.
 * @param text - The text to generate vectors from.
 * @param metadata - The metadata associated with the item.
 * @returns A promise that resolves to an array of vectors.
 */
export async function generateVectors(
  env: Env,
  id: string,
  text: string,
  metadata: Record<string, any>
) {
  const modelResp = await env.AI.run(
    embeddingsModel,
    { text: [text] },
    {
      gateway: {
        id: gatewayId,
        skipCache: false,
        cacheTtl: 172800,
      },
    }
  );

  return modelResp.data.map((vector) => ({
    id: `${id}`,
    values: vector,
    metadata,
  }));
}
```

For this process, I choose to use [BAAI/bge-base-en-v1.5](https://huggingface.co/BAAI/bge-base-en-v1.5) as an embeddings model. Not only is it open source (MIT License), it touts 1024 dimensions, 512 maximum tokens and a 64.23 [MTEB average](https://huggingface.co/blog/mteb), that puts it at number 38 on the Hugging Face leaderboard, which is decent enough for me, while being lightweight enough to run on the edge.

Once the embeddings are generated, I store them in the Vectorize database using the following code:

```javascript
const vectors = await generateVectors(env, id, queryText, {
  ...metadata,
  hasExtendedContent,
});
const insertedItem = await env.VECTORIZE.upsert(vectors);
```

### Searching the content

Now that the content has been stored and vectorised, I was able to start work on the frontend functionality that will allow users to query the content.

To do this, I decided to use the [Remix](https://remix.run/) framework, I work with Next quite a lot and thought that this would be a good chance to try something I don't always work with. On the site, I created a simple search box on the homepage. Once the user enters a query, the site will call a function on the server that will first generate embeddings using the same model as before.

That looks like this:

```javascript
/**
 * Generates a query vector for the given user query using the AI service.
 *
 * @param userQuery - The user query string.
 * @param env - The environment object containing various services.
 * @returns A promise that resolves to an EmbeddingResponse object.
 */
export async function getQueryVector(
  userQuery: string,
  env: Env
): Promise<EmbeddingResponse> {
  if (!env.AI) {
    throw new Error('AI service not available');
  }

  return env.AI.run(
    embeddingsModel,
    { text: [userQuery] },
    {
      gateway: {
        id: gatewayId,
        skipCache: false,
        cacheTtl: 172800,
      },
    }
  );
}
```

Then we make a call to the vvectorize database to get the matches:

```javascript
/**
 * Fetches the matching results for the given query vector using the VECTORIZE service.
 *
 * @param queryVector - The query vector generated from the user query.
 * @param env - The environment object containing various services.
 * @returns A promise that resolves to the matching results.
 */
export async function getMatches(queryVector: EmbeddingResponse, env: Env) {
  if (!env.VECTORIZE) {
    console.error('VECTORIZE service not available');
    return [];
  }

  return env.VECTORIZE.query(queryVector.data[0], {
    topK: 15,
    returnMetadata: true,
  });
}
```

topK is set to 15 here, if you want to change the number of results that are returned, you should change this number.

### Rendering the results and providing additional functionality

Now that we have the matches, it's just a case of rendering the list.

To do this, I created a simple list which displays the basic details and then a couple of buttons to view the full content and also use a couple of AI services to either generate a summary of the article or to analyse the content for sentiment and political bias.

To do this, I created an SSE endpoint that will be called when the user clicks the button, these use the model [mistralai/Mistral-7B-Instruct-v0.1](https://huggingface.co/mistralai/Mistral-7B-Instruct-v0.1) to generate the summaries and analysis, chosen once again because it is an open source model (Apache 2.0 license) that's capable enough for my requiredments, although, as noted below, it did have some drawbacks.

Here's what the query to summarise the content looks like:

```javascript

    return new Response(
      await env.AI.run(
        loraModel,
        {
          stream: true,
          raw: true,
          prompt: `<s> [INST] Your task is to provide a professional summary of the article provided.

Use the content provided under the heading "Article" and only that content to conduct your analysis. Do not embellish or add detail beyond the source material. The term "Article" is a placeholder for the actual content and should not be included in your output.

Always assist with care, respect, and truth. Ensure replies are useful, secure, and promote fairness and positivity, avoiding harmful, unethical, prejudiced, or negative content.

### Article ###:
${article}

### Instructions ###:
1. Read the "Article" carefully, noting the main topics and subjects.
2. Do not include any conversational phrases, personal comments, or introductions. Only provide the summary and necessary sections as outlined below.
3. Provide your response in English only.
4. Your summary must be between 300-400 words long (excluding keywords). This range is for internal use and should not be mentioned in the output.
4a. Ensure all points are complete within this limit, even if fewer points are included or slight extensions are made. Do not cut points short, and do not include the word count in the output.
5. Your report must include the following sections:
   - **Introduction**: Briefly introduce the "Article" in no more than 30 words.
   - **Key Findings**: Summarize 3-5 key findings and insights concisely, using approximately 220 words. Prioritize the most impactful points.
   - **Quotes**: Include at least one brief illustrative quote that significantly enhances a key finding. Paraphrase where possible to maintain brevity.
   - **Context and Inferences**: Provide any relevant context or inferences in about 30 words, if space allows.
   - **Keywords**: List relevant subject keywords for content tagging, focusing on core topics and themes.
6. Format your summary in clear paragraphs with headings for each section. Use Markdown format. Bullet points may be used for clarity where appropriate.

[/INST]

Summary: </s>`,
        },
        {
          gateway: {
            id: gatewayId,
            skipCache: env.ENVIRONMENT === 'development',
            cacheTtl: 172800,
          },
        }
      ),
      {
        headers: {
          'Content-Type': 'text/event-stream',
          'Cache-Control': 'no-cache',
          Connection: 'keep-alive',
        },
      }
    );
```

And the analyse the article:

```javascript

    const article = matchingItem[0].text;
    return new Response(
      await env.AI.run(
        loraModel,
        {
          stream: true,
          raw: true,
          prompt: `<s> [INST] Your task is provide a comprehensive analysis that identifies any potential bias, political leanings, and the tone of the content, evaluating the presence of bias and political alignment in the article provided.

Use the content provided under the heading "Article" and only that content to conduct your analysis. Do not embellish or add detail beyond the source material. The term "Article" is a placeholder for the actual content and should not be included in your output.

Always assist with care, respect, and truth. Respond with utmost utility yet securely. Avoid harmful, unethical, prejudiced, or negative content. Ensure replies promote fairness and positivity.

### Article ###:
${article}

### Instructions ###:
1. Carefully read the "Article" and note any language, phrasing, or content that may indicate bias or political alignment.
2. Do not include any conversational phrases, personal comments, or introductions. Only provide the summary and necessary sections as outlined below.
3. Provide your response in English only.
4. Your analysis must include the following sections:
   - **Introduction**: Briefly introduce the "Article" and its main topic or focus.
   - **Bias Detection**: Identify any signs of bias in the language, tone, or presentation of facts. This includes loaded language, unbalanced reporting, omission of key perspectives, or any use of subjective language that could sway the reader's opinion.
   - **Political Alignment**: Analyze the content for indicators of political alignment. This can include the portrayal of political figures, policies, or ideologies in a favorable or unfavorable light, as well as any endorsement or criticism that aligns with specific political ideologies.
   - **Examples and Evidence**: Provide specific examples from the text to support your findings. This should include direct quotes or paraphrased content that clearly illustrates the bias or political alignment identified.
   - **Conclusion**: Summarize your findings, highlighting the overall bias and political alignment, if any, and the potential impact on the reader's perception.
5. Format your analysis in clear, organized paragraphs with appropriate headings for each section. Use the Markdown format.
6. Maintain a neutral and objective tone throughout your analysis. Avoid subjective judgments or interpretations that are not directly supported by evidence from the "Article".

[/INST]

Analysis: </s>`,
        },
        {
          gateway: {
            id: gatewayId,
            skipCache: false,
            cacheTtl: 172800,
          },
        }
      ),
      {
        headers: {
          'Content-Type': 'text/event-stream',
          'Cache-Control': 'no-cache',
          Connection: 'keep-alive',
        },
      }
    );
```

These are then streamed to the client, using the hook from [GitHub repo](https://github.com/ananni13/remix-openai-sse/blob/main/app/lib/use-event-source.ts) to create the event source.

In the future, I'd like to expand this to use low-rank adaptation (LoRA) to allow me to provide more specific models for the particular content and learn a bit more about how they work.

Some more information on the LoRA model can be found [here](https://www.cloudflare.com/en-gb/learning/ai/what-is-lora/).

## Challenges and Future Directions

- Getting enough content: One of the biggest challenges during this work was getting enough content to be able to test the system effectively, in the end I had to process much more than I originally planned in order to get to a point where I had a few good examples to test with.

- Vectorize pre GA: While I was developing this, Vectorize from Cloudflare hadn't reached GA yet, now that it has, the structure has changed quite a bit. This means that it may need quite a lot of re-working to get it to work with the new system.

- Random content being returned: Either my prompts aren't the best, the content wasn't parsed well enough or I didn't choose the best models, but I did find that quite often the AI for summarise and analyse functionality would return random content that didn't make sense, sometimes Russian for some reason.

- LoRA: As previously mentioned, I'd like to expand this research to use LoRA and get a bit deeper into some of the capabilities of AI.

## Check it out

Hopefully this has been interesting, if you'd like to check out the project, you can find it on [GitHub](https://github.com/nicholasgriffintn/llm-rss-vectorise-agent/tree/main).