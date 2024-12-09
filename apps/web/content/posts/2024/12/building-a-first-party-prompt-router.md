---
title: "Building a First Party Prompt Router"
date: "2024-12-09T20:51"
tags: [ai, prompt-router, aws]
description: Recently at AWS re:invent, AWS announced [Intelligent Prompt Routing in Bedrock](https://aws.amazon.com/bedrock/intelligent-prompt-routing/). While this looks although fantastic and useful for many, when I saw the announcement, I thought to myself, "I wonder how hard it would be to build my own?".\n\nAnd so that's what I've set out to do.\n\nIn this post, I'll be going through the work I've done so far, including building keyword recognition, ai prompt analysis and weighting to select the best model for a given prompt.
---

## Keyword Recognition

To start with, I figured the best step would be to have some sort of keyword recognition, I thought this as having an array of keywords would immediately allow us to categorise a prompt and provide some extra context for the AI.

To start with, I'm going to have two sets of keywords, one for coding and one for math.

**Coding Keywords**

```typescript
CODING_KEYWORDS = {
    languages: ["python", "javascript", "typescript", ...],
    concepts: ["code", "program", "function", ...],
    dataStructures: ["array", "list", "stack", ...],
    webDev: ["react", "vue", "angular", ...],
    practices: ["testing", "optimization", "debugging", ...]
}
```

**Math Keywords**

```typescript
MATH_KEYWORDS = {
    general: ["calculate", "solve", "equation", ...],
    branches: ["algebra", "geometry", "calculus", ...],
    concepts: ["matrix", "vector", "derivative", ...],
    applications: ["optimization", "regression", ...]
}
```

I've separated these into categories to make it easier to maintain.

To categorise the keywords from the prompt, I first join these up into one set of filters:

```typescript
	private static readonly FILTERS = {
		coding: new KeywordFilter(KeywordFilter.getAllCodingKeywords()),
		math: new KeywordFilter(KeywordFilter.getAllMathKeywords()),
	};
```

Then I map over the filters and get the matches for each filter:

```typescript
	private static extractKeywords(prompt: string): string[] {
		const categorizedMatches = Object.entries(PromptAnalyzer.FILTERS).reduce(
			(acc, [domain, filter]) => {
				const matches = filter.getCategorizedMatches(prompt);
				for (const [key, value] of Object.entries(matches)) {
					acc[key] = [...(acc[key] || []), ...value];
				}
				return acc;
			},
			{} as Record<string, string[]>,
		);

		const allMatches = Object.values(categorizedMatches).flat();
		if (allMatches.length > 0) {
			return [...new Set(allMatches)];
		}

		return PromptAnalyzer.fallbackKeywordExtraction(prompt);
	}
```

`getCategorizedMatches` is the core function that processes input text to find matching keywords. Here's how it works:

1. First, it tokenizes the input text by:
   - Converting to lowercase
   - Splitting on spaces, commas, periods, and hyphens
   - Filtering out words shorter than 3 characters

2. Then for each word, it:
   - Checks against both coding and math keyword lists
   - Uses fuzzy matching (via Levenshtein distance) to catch slight variations
   - Groups matches by their category (e.g., "coding_languages", "math_concepts")

For example, given the input "help me debug this python code", it might return:

```typescript
{
  coding_languages: ["python"],
  coding_practices: ["debug", "code"]
}
```

The fuzzy matching is handled by calculating the Levenshtein distance - a measure of how different two strings are. For example:

- "python" vs "python" = 100% match
- "debuging" vs "debugging" = 93% match
- "code" vs "coding" = 80% match

This allows the system to catch common misspellings and variations while still maintaining accuracy.

You can find the full [code for this here](https://github.com/nicholasgriffintn/assistant/blob/main/src/lib/keywords.ts).

## Prompt Analysis

Now I have the keywords, I need to analyse the prompt.

To do this, I created a new class with a method to analyse the input from the user with AI.

```typescript
	private static performAIAnalysis(
		provider: AIProvider,
		env: IEnv,
		prompt: string,
		keywords: string[],
	) {
		return provider.getResponse({
			env,
			model: PromptAnalyzer.DEFAULT_MODEL,
			disableFunctions: true,
			messages: [
				{
					role: "system" as ChatRole,
					content: PromptAnalyzer.constructSystemPrompt(keywords),
				},
				{ role: "user", content: prompt },
			],
		});
	}
```

Constructing the system prompt is the main part of this really, it looks like this:

```typescript
	private static constructSystemPrompt(keywords: string[]): string {
		const categorizedKeywords = keywords.reduce(
			(acc, keyword) => {
				for (const [domain, filter] of Object.entries(PromptAnalyzer.FILTERS)) {
					const categories = filter.getCategorizedMatches(keyword);
					if (Object.keys(categories).length > 0) {
						acc[domain] = acc[domain] || {};
						for (const [category, words] of Object.entries(categories)) {
							acc[domain][category] = [
								...(acc[domain][category] || []),
								...words,
							];
						}
					}
				}
				return acc;
			},
			{} as Record<string, Record<string, string[]>>,
		);

		return `Analyze the given prompt and return a JSON object with the following properties:
      - expectedComplexity: number 1-5 indicating task complexity
      - requiredCapabilities: array of required model capabilities from ${JSON.stringify(
				availableCapabilities,
				null,
				2,
			)}
      - estimatedInputTokens: estimated number of input tokens
      - estimatedOutputTokens: estimated number of output tokens
      - needsFunctions: boolean indicating if the task requires function calling based on the available tools: ${JSON.stringify(
				availableFunctions,
				null,
				2,
			)}
      
      Base the analysis on these categorized keywords: ${JSON.stringify(categorizedKeywords, null, 2)}`;
	}
```

This tells the AI to return a JSON object with the following properties:

- expectedComplexity: number 1-5 indicating task complexity
- requiredCapabilities: array of required model capabilities that we have available
- estimatedInputTokens: estimated number of input tokens
- estimatedOutputTokens: estimated number of output tokens
- needsFunctions: boolean indicating if the task requires function calling based on the available tools

We then use this data to work out which model is the best fit for the prompt given.

## Model Selection

To start, we need to identify some core capabilities and configuration for the models that we want to make available to the router.

To do this, we have created a new array:

```typescript
export const modelCapabilities: Record<string, ModelCapabilities> = {
	"o1-preview": {
		card: "https://www.prompthub.us/models/o1-preview",
		contextWindow: 128000,
		maxTokens: 32800,
		costPer1kInputTokens: 0.015,
		costPer1kOutputTokens: 0.06,
		strengths: ["coding", "analysis", "math", "reasoning", "multilingual"],
		contextComplexity: 5,
		reliability: 4,
		speed: 2,
	},
	"o1-mini": {
		card: "https://www.prompthub.us/models/o1-mini",
		contextWindow: 16384,
		maxTokens: 65500,
		costPer1kInputTokens: 0.003,
		costPer1kOutputTokens: 0.012,
		strengths: ["coding", "analysis", "math", "reasoning", "multilingual"],
		contextComplexity: 4,
		reliability: 4,
		speed: 3,
	},
  ...
};
```

Most of this information comes from what the provider has detailed outside of the strengths, context complexity, reliability and speed, those are really just made up by me, based on my own experience and what I think these models are best at.

Next up we create a new `ModelRouter` class which will take all this data, score each of the models and then return the one with the highest score (or matches the most closely).

First up, I made some weights for each of the criteria:

```typescript
private static readonly WEIGHTS = {
  COMPLEXITY_MATCH: 2,
  BUDGET_EFFICIENCY: 3,
  RELIABILITY: 1,
  SPEED: 1,
  MULTIMODAL: 5,
  FUNCTIONS: 5,
}
```

Then we decide on how to return depending on the capabilities of the model.

We start with a couple of early returns:

- If the prompt has no required capabilities, we return the default model
- If the models are out of the budget, we return the default model

Then we calculate the score for each of the models:

```typescript
	private static calculateScore(
		requirements: PromptRequirements,
		capabilities: ModelCapabilities,
	): number {
		let score = 0;

		// Complexity match score
		score +=
			Math.max(
				0,
				5 -
					Math.abs(
						requirements.expectedComplexity - capabilities.contextComplexity,
					),
			) * ModelRouter.WEIGHTS.COMPLEXITY_MATCH;

		// Budget efficiency score
		if (requirements.budgetConstraint) {
			const totalCost = ModelRouter.calculateTotalCost(
				requirements,
				capabilities,
			);
			score +=
				(1 - totalCost / requirements.budgetConstraint) *
				ModelRouter.WEIGHTS.BUDGET_EFFICIENCY;
		}

		// Base capability scores
		score += capabilities.reliability * ModelRouter.WEIGHTS.RELIABILITY;
		score += (6 - capabilities.speed) * ModelRouter.WEIGHTS.SPEED;

		// Special capability scores
		if (requirements.hasImages && capabilities.multimodal) {
			score += ModelRouter.WEIGHTS.MULTIMODAL;
		}

		if (requirements.needsFunctions && capabilities.supportsFunctions) {
			score += ModelRouter.WEIGHTS.FUNCTIONS;
		}

		return score;
	}
```

Rank them based on those scores:

```typescript
	private static rankModels(requirements: PromptRequirements): ModelScore[] {
		return Object.keys(modelCapabilities)
			.map((model) => ModelRouter.scoreModel(requirements, model as Model))
			.sort((a, b) => b.score - a.score);
	}
```

Finally, we select the best model:

```typescript
	private static selectBestModel(modelScores: ModelScore[]): Model {
		if (modelScores[0].score === 0) {
			console.warn("No suitable model found. Falling back to default model.");
			return defaultModel;
		}

		return modelScores[0].model;
	}
```

You can find the full [code for this here](https://github.com/nicholasgriffintn/assistant/blob/main/src/lib/modelRouter.ts).

## Performance and Operational Issues

One thing to note before I finish up is that there are some performance issues here.

As we're adding on another AI call, we're ultimately slowing down the response time of the user's request, sometimes by a fair amount, at the moment, I'm using Mistral NeMo as I thought it would have a good range of knowledge while being cheap and fast.

I might want to try out some other models and see if they perform better, but really, I think I might want to build some sort of a benchmark first.

Alongside this, Mistral does have some pretty aggressive rate limiting, so there are occasions when the analysis gets rate limited, in this case, the code is designed to just fall back to the default model.

## Conclusion

And that's pretty much it, outside of that, we just call the methods if the user hasn't provided a specific model.

I've been using this myself now for a few hours and I'm pretty happy with the overall implementation, the code is a little messy and so there is room for improvement, but I think that this is a good solution to having a smarter prompt selection that keeps me from having to use a third party.

That said, the Bedrock version is probably going to be better for the majority of people in the long run, unless you're using Open Source or local models.