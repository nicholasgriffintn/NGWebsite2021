---
title: Investigating Cloudflare Workers for Python [WIP]
description: I do quite a few things in Python, in particular, it's a great language for data projects. Recently Cloudflare added beta support for Python in their Workers platform, so I thought I'd investigate, but for that, I needed a cool project to work on, so not only is this a post about exploring the support for Python in Cloudflare Workers, but it's also about building a chatbot that can interact with eBooks, if Cloudflare Workers with Python actually works anyway...
date: "2024-11-10"
updated: "2024-11-10"
tags: [cloudflare, workers, python, fastapi, vectorize, ai, rag, chatbot, ebooks]
---

To kick things off, I needed a new project idea to work on.

As mentioned above, I figured a good idea might be to build a chatbot that can interact with an eBook as this will take advantage of Cloudflare's other services like vectorize and AI to build a RAG chatbot that can answer questions about the book.

## Finding source material

To do this project I'd need some source material to work with that had a lot of text, a number of people were familiar with and was in the public domain.

After a bit of searching, I can across [Project Gutenberg](https://gutenberg.org/), which is a service that provides a number of epub and Kindle ebook resources that can be downloaded or read online, for free.

Most of the works are now in the public domain due to their U.S. copyright expiring, so I figured this would be a good place to start.

There are a wide range of options available, and if I continue with this project, I might use a few of them. For now, I decided to start with [Alice's Adventures in Wonderland by Lewis Carroll](https://gutenberg.org/ebooks/11) as I think it's a story that people are familiar with and there are a number of characters, which is particularly interesting as I was thinking it might be cool to have something where you could talk to the characters in the book.

## Setting up a Python project

To kick off the project, I decided to use a Python package manager that I haven't used before, [uv](https://docs.astral.sh/uv/#getting-started), this lets me check out a few new things at the same time.

To setup uv, I installed it with `curl -LsSf https://astral.sh/uv/install.sh | sh` and then ran `source $HOME/.cargo/env` to get it working. Then I ran `uv init` to create an initial project setup.

Running the project is then as simple as running `uv run src/main.py`.

All this worked great but as we move to using Cloudflare Workers, we won't actually be using uv, it was mostly for this initial setup and package management.

## Setting up Cloudflare Workers

[Cloudflare Workers for Python](https://developers.cloudflare.com/workers/languages/python/) is a new feature that is currently in beta, and is the first time that Workers have been available for a language other than JavaScript.

They are meant to work with all of the Workers bindings and include some support for a few Python packages.

You can find out more in the [release blog post here](https://blog.cloudflare.com/python-workers/).

Setting this up is as simple as creating a new `wrangler.toml` file with the following content:

```toml
name = "genai-rag-ebooks"
main = "src/main.py"
compatibility_flags = ["python_workers"]
compatibility_date = "2024-01-29"
```

Then you can run `npx wrangler@latest dev --local  --persist-to="./data/` to start the server on `http://localhost:8787`.

## Integrating fastAPI

For this project, we'll need a frontend and a few APIs that can be called to interact with the chatbot, to do this, I'll be using [fastAPI](https://fastapi.tiangolo.com/) which is a Python API framework.

To integrate this, first I installed it with `uv add fastapi` and then I added the following code to the `main.py` file:

```python
from fastapi import FastAPI, Request

async def on_fetch(request, env):
    import asgi

    return await asgi.fetch(app, request, env)


app = FastAPI()
```

Then we add a placeholder homepage route:

```python
@app.get("/")
async def homepage():
    return {"message": "Hello, World!"}
```

And a route for ingesting the book:

```python
@app.post("/ingest")
async def ingest(req: Request):
    return {"message": "Ingesting the book"}
```

These will be expanded in later stages.

## Ingesting the book

Before I can do stuff with AI, I need to store the contents of the books that I want to use in some sort of database.

For this, I decided to use [Cloudflare KV](https://developers.cloudflare.com/kv/), which is a key-value store that is available to Workers, it's pretty simple to use as it works over Bindings and is also pretty fast.

You just need to configure KV in the dashboard and then add a reference to it in the Wrangler file like so:

```toml
kv_namespaces = [
  { binding = "BOOKS", id = "<YOUR_KV_ID>", preview_id = "<YOUR_KV_ID>" }
]
```

I stored this in KV using the Cloudflare dashboard and then this can be retrieved with code like this:

```python
book_key = 'alice-in-wonderland'
logger.debug(f'Fetching book with key: {book_key}')
book_text = await env.BOOKS.get(book_key);
```

This returns the contents of the book as a string.

For local development, we need to persist this in storage like so:

```bash
npx wrangler kv:key put alice-in-wonderland "<BOOK_TEXT>" --binding BOOKS --local --persist-to data --preview
```

I then need to split the initial copyright information and the end contents of the download from Project Gutenberg as I don't want this text to end up as embeddings in the AI.

Then I split the text into paragraphs and remove the content that we don't want to be included as potential responses as they won't be very useful.

## Vectorizing the text

To make the text searchable by AI, I need to vectorize it, for this I used [Cloudflare Vectorize](https://developers.cloudflare.com/vectorize/), again, this is a good option as it links up to Cloudflare Workers via Bindings.

To use this, we need to configure it in the Wrangler file like so:

```toml
[[vectorize]]
binding = "VECTORIZE"
index_name = "genai-rag-ebooks"

[ai]
binding = "AI"
```

You'll need to make sure that AI is setup in Cloudflare and generate a Vectorize index, like so:

```bash
npx wrangler vectorize create genai-rag-ebooks --dimensions=768 --metric=cosine
```

And then we should first need to query Cloudflare AI to get the embeddings for the text, like so:

```python
embeddings = await env.AI.run(
    "@cf/baai/bge-large-en-v1.5",
    {
        "text": ["<TEXT_FROM_THE_BOOK>"],
    }
)
```

And then insert those embeddings into the Vectorize index, like so:

```python
vectors = []
id = 1
for vector in model['data']:
    vectors.append({
        "book": book_key,
        "id": id,
        "vector": vector
    })
    id += 1

inserted = await env.VECTORIZE.upsert(vectors)
```

However, this is where I got stuck, using `env.AI` here doesn't seem to like how I was passing the data as I was getting this error: `ERROR:main:AiError: 5006: must have required property 'text'`.

So instead I opted to use the API directly, this is not ideal but it works for now, outside of having to use a dependency, given that Cloudflare doesn't support external dependencies yet, however, we are already using faatAPI, so the worker already can't be deployed until they have that support.

However, I still can't get that to work for some reason, getting an error: `Failed to establish a new connection: [Errno 50] Protocol not available'`.

When I have a bit more time I'll be coming back to this, so come back for any updates.

You can also check out the code for this project [here](https://github.com/nicholasgriffintn/genai-rag-ebooks).

## Still todo

- Figure out how to get AI to work with Python Workers
- Will need to vectorize the text within the book into CloudFlare Vectorize.
- Use a RAG model to generate responses to questions about the book.
- Will need to build a simple API to interact with the chatbot.
- Will need to build a simple frontend to interact with the chatbot.
