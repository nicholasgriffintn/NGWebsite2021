---
title: "Cloudflare adds OpenRouter to AI Gateway"
date: "2024-11-30T18:21"
tags: [cloudflare, openrouter, ai, ai-gateway]
link: https://developers.cloudflare.com/ai-gateway/providers/open-router/
isBookmark: true
---

OpenRouter is a pretty cool service that provides an OpenAI-compatible completion API service for (at the time of writing) 270+ models and providers that makes them accessible directly or through the OpenAI SDK.

Cloudflare have their own service called AI Gateway which can be used to proxy a number of services, providing caching, rate limiting, metrics and more.

This week, Cloudflare enhanced this service with support for OpenRouter, in beta. It's quite straightforward to set up. If you've been following along with my assistant application, you can see the change that I made to support this [here](https://github.com/nicholasgriffintn/assistant/commit/6f99dd1364d4b95efdc0ffd06c35f4ce0e6ac80f).