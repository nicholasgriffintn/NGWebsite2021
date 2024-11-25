---
title: "Anthropic's new standard for connecting AI assistants"
date: "2024-11-25T23:45"
tags: [anthropic, ai, model-context-protocol]
link: "https://www.anthropic.com/news/model-context-protocol"
isBookmark: true
---

Anthropic has made an interesting announcement today with the release of a new Open Sourced standard, the Model Context Protocol (MCP).

As an effort to provide a standardised interface for LLMs to interact with other applications, this is a particularly interesting announcement given that this can be quite a complicated thing to do at the moment and as ANthropic mentions "As AI assistants gain mainstream adoption, the industry has invested heavily in model capabilities, achieving rapid advances in reasoning and quality. Yet even the most sophisticated models are constrained by their isolation from data—trapped behind information silos and legacy systems", with every data source requiring its own custom implementation.

MCP aims to solve this with new two-way connections between data sources and AI tools, which developers will integrate through MCP servers ([a few examples available here](https://github.com/modelcontextprotocol/servers/tree/main/src)), these are then set up via the Claude Desktop app currently, but the aim is to expand this.

The specification already stats that there will be a HTTP SSE protocol that should expand it to other applications over time.