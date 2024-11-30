---
title: "Bluesky is awesome for developers, you should check it out"
date: "2024-11-26T22:16"
tags: [bluesky, social-media]
description: When Twitter first launched it really was a place for great conversation amongst a number of communities, including developers who built many tools with their API. Once Elon took over and added restrictions and outrageous pricing for the API, it became something that you can no longer hack around with. Recently, like many others, I've been looking at some of the things that you can do with Bluesky and I have to say, this is the platform for developers.
image: "/uploads/bluesky-is-awesome-for-developers/featured.png"
imageAlt: "A screenshot showing the Bluesky timeline"
hideFeaturedImage: true
---

In case you don't already know, Bluesky is a new open-source microblogging platform that has been built using the AT Protocol, an open and decentralised network for social applications.

This makes it inherently awesome for developers, allowing anyone to build on top of the platform and create new and interesting tools that can interact with the network.

## Jetstream

Last month, Jaz (a developer from Bluesky) released a new firehose as a lightweight firehose for AT Proto that provides a stream of the posts on their platform and then makes it available over a WebSocket connection called Jetstream.

You can read [the blog post explaining it and how it works here](https://jazco.dev/2024/09/24/jetstream/).

Simon Willison [wrote a post](https://simonwillison.net/2024/Nov/20/bluesky-websocket-firehose/) about this a little while back where they created a quick monitoring demo that connects to this websocket and displays the posts in real-time.

That's super cool but I wondered how far you could could and wanted to have a play myself so I got v0 to build a quick tool that's basically the same thing but with some graphs, a message feed and a few other nice bits like a delay and the ability to scroll the feed and queue further messages.

You can [check it out here](https://bluesky-live.vercel.app/), also, here's a GIF of it in action:

![Bluesky Live](/uploads/bluesky-is-awesome-for-developers/bluesky-live.gif).

If you're interested in the prompts or code, you can also [find that here](https://v0.dev/chat/kkVVcn9FECh?b=b_gYRk5YVaWh9).

There's an even cooler example of what could be done with this in 3d by [Theo Sanderson here](https://firehose3d.theo.io/), which is definitely a bit cooler.

## Other tools that developers have built

That was just a couple of things that you could do with the Jetstream firehose, but that's not the limits of what you can do with Bluesky.

There's also a whole list of projects in the [Awesome ATProto](https://github.com/beeman/awesome-atproto) and [Awesome Bluesky](https://github.com/fishttp/awesome-bluesky) repos that are definitely worth checking out.

Some of my favourites include:

- [Bcounter](https://bcounter.nat.vg/) - A near real time counter of new users on Bluesky.
- [Bluesky Stats](https://vqv.app/stats/) - A dashboard that's a little bit more expansive with total posts, follows and likes on the platform.
- [SkyKit](https://skykit.blue) - A tool for getting analytics for a users content, including average likes, reposts and replies per post, reply rate, engagement and more.
- [SkyZoo](https://skyzoo.blue) - This is a similar analytics platform but maybe a little nicer, it even assigns you to an animal, so that's cool.

## API

And if you want to build something youself, Bluesky tops all of this off with a great API that's well documented and easy to use.

You can find the [API documentation here](https://docs.bsky.app/).

You'll even find some SDKs there, which is actually a little unheard of in social media honestly.
