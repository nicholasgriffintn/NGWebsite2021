---
title: "Anthropic's new standard for connecting AI assistants"
date: "2024-11-25T23:45"
tags: [anthropic, ai, model-context-protocol]
link: "https://www.anthropic.com/news/model-context-protocol"
isBookmark: true
---

Anthropic has made an interesting announcement today with the release of a new open sourced standard, the Model Context Protocol or MCP.

As an effort to provide a standardised interface for LLMs to interact with other applications, this is a particularly interesting announcement given that this can be quite a complicated thing to do at the moment and as Anthropic mentions "As AI assistants gain mainstream adoption, the industry has invested heavily in model capabilities, ... Yet even the most sophisticated models are constrained by their isolation from data—trapped behind information silos and legacy systems", with every data source requiring its own custom implementation.

MCP aims to solve this with new two-way connections between data sources and AI tools, which developers will create through "MCP servers" ([a few examples available here](https://github.com/modelcontextprotocol/servers/tree/main/src)), these are then set up via the Claude Desktop app currently, but the aim is to expand this.

The [specification](https://spec.modelcontextprotocol.io/specification/) goes into much more detail, you should deffo check it out.