---
title: "Protecting Content with AWS Bedrock Guardrails"
date: "2024-12-04T18:36"
tags: [ai, aws, aws-bedrock, guardrails]
description: Back in July of this year, AWS made its guardrails feature from Bedrock available as a standalone API. With this and the recent announcements of new functionality, I thought it might be a great time for me to take a look at the functionality to see how it works and how I could use it in my own projects, starting with my personal assistant.
image: /uploads/protecting-content-with-aws-bedrock/bedrock_configuration_filters.png
imageAlt: A screenshot from the AWS console, showing the configuration filters for a guardrail.
hideFeaturedImage: true
---

In case you don't already know, Amazon Bedrock Guardrails provides configurable safeguards that help builders to protect their AI applications at AWS' scale (although as I'll elaborate on later, you could actually use if for more than that via the API).

It does this through a set of configurable rules and automated reasoning that not only blocks undesirable and harmful content but also filters factual errors and hallucinations that it is able to detect. And all of this is managed through their interface, which makes it easy for users to manage, without having to update code.

## Setting up

To get set up, you need to first log into the AWS Console.

From there, make sure you're in a good region for working with Bedrock, I would recommend either `us-east-1` or `us-west-2` depending on your location as they have the most models available on the platform.

Then navigate to Bedrock and on to the Guardrails section. From here, click on the `Create guardrail` button:

![Create guardrail](/uploads/protecting-content-with-aws-bedrock/aws_console_setup.png)

That will bring up a form to configure your guardrail, which will include setting up a name, description, and rules.

The first set of rules are the content filters, which is how you configure filters against harmful inputs and model responses.

AWS gives you a number of categories within harmful categories and prompt attacks, within which you can set the threshold between "None" and "High".

![Bedrock guardrail setup](/uploads/protecting-content-with-aws-bedrock/bedrock_configuration_filters.png)

Recently (today), AWS also added support for detection in images, which you'll also see in those options. You can [read more about that here](https://aws.amazon.com/blogs/aws/amazon-bedrock-guardrails-now-supports-multimodal-toxicity-detection-with-image-support/)

After that, you may want to set up "denied topics".

You can have up to 30 of these, they are ways to block certain topics from user inputs or model responses.

For example, here, I'm blocking anything to do with crypto or NFTs:

![Bedrock denied topics](/uploads/protecting-content-with-aws-bedrock/bedrock_denied_topics.png)

After that, you can also set up some word filters, including:

- A profanity filter for blocking profane words (a pre-defined a list)
- A manual list of words
- A list of words from a local file
- A list of words from an S3 bucket

Once you're done there, the next step is for sensitive information, from which you can select a number of pre-defined PII types to block or mask as well as being able to set up to 10 of your own regex patterns.

![Bedrock sensitive information](/uploads/protecting-content-with-aws-bedrock/bedrock_pii.png)

The last step before review is to optionally configure their grounding and relevance checks.

Grounding will validate if the models responses are factually correct based on infromation that was provided in the reference source and will block a response if it is below that threshold.

Relevance will check that the response are relevant to the input provided and then block any responses that are below the threshold.

![Bedrock grounding and relevance](/uploads/protecting-content-with-aws-bedrock/bedrock_grounding.png)

AWS also recently announced an [Automated Reasoning feature](https://aws.amazon.com/blogs/aws/prevent-factual-errors-from-llm-hallucinations-with-mathematically-sound-automated-reasoning-checks-preview/) at re:invent.

I don't have access to this yet so I can't talk about that all too much, however, it does sound pretty cool.

Once you've submitted, you should be able to test the guardrail from the UI and then create versions for use in your applications.

## Implementing the API

Now that we're set up, we are ready to start implementing he [Guardrail API](https://docs.aws.amazon.com/bedrock/latest/userguide/guardrails-use-independent-api.html) into our application.

As with a few other AWS APIs, this is a little complex, however, once implemented it seems to work pretty well.

I already had a LlamaGuard implementation that I was investigating previously, so the kick things off, I first needed to adjust that a bit so that it could be expanded for use with other providers, like Bedrock Guardrails, through a new `Guardrails` class.

```typescript
import type { GuardrailResult, GuardrailsProvider } from '../../types';
import { AppError } from '../../utils/errors';
import { GuardrailsProviderFactory } from './factory';

export class Guardrails {
	private static instance: Guardrails;
	private provider: GuardrailsProvider;
	private env: any;

	private constructor(env: any) {
		this.env = env;

		if (env.GUARDRAILS_PROVIDER === 'bedrock') {
			if (!env.BEDROCK_AWS_ACCESS_KEY || !env.BEDROCK_AWS_SECRET_KEY || !env.BEDROCK_GUARDRAIL_ID) {
				throw new AppError('Missing required AWS credentials or guardrail ID', 400);
			}

			this.provider = GuardrailsProviderFactory.getProvider('bedrock', {
				guardrailId: env.BEDROCK_GUARDRAIL_ID,
				guardrailVersion: env.BEDROCK_GUARDRAIL_VERSION || 'DRAFT',
				region: env.AWS_REGION || 'us-east-1',
				accessKeyId: env.BEDROCK_AWS_ACCESS_KEY,
				secretAccessKey: env.BEDROCK_AWS_SECRET_KEY,
			});
		} else {
			// Default to LlamaGuard if no specific provider is set
			this.provider = GuardrailsProviderFactory.getProvider('llamaguard', {
				ai: env.AI,
			});
		}
	}

	public static getInstance(env: any): Guardrails {
		if (!Guardrails.instance) {
			Guardrails.instance = new Guardrails(env);
		}
		return Guardrails.instance;
	}

	async validateInput(message: string): Promise<GuardrailResult> {
		if (this.env.GUARDRAILS_ENABLED === 'false') {
			return { isValid: true, violations: [] };
		}
		return await this.provider.validateContent(message, 'INPUT');
	}

	async validateOutput(response: string): Promise<GuardrailResult> {
		if (this.env.GUARDRAILS_ENABLED === 'false') {
			return { isValid: true, violations: [] };
		}
		return await this.provider.validateContent(response, 'OUTPUT');
	}
}
```

This uses a factory to create a standardised interface:

```typescript
import type { GuardrailsProvider } from '../../types';
import { BedrockGuardrailsProvider, type BedrockGuardrailsConfig } from './bedrock';
import { AppError } from '../../utils/errors';
import { LlamaGuardProvider, type LlamaGuardConfig } from './llamaguard';

export class GuardrailsProviderFactory {
	static getProvider(type: string, config: BedrockGuardrailsConfig | LlamaGuardConfig): GuardrailsProvider {
		switch (type) {
			case 'bedrock':
				if (!('guardrailId' in config)) {
					throw new AppError('Invalid config for Bedrock provider', 400);
				}
				return new BedrockGuardrailsProvider(config);
			case 'llamaguard':
				if (!('ai' in config)) {
					throw new AppError('Invalid config for LlamaGuard provider', 400);
				}
				return new LlamaGuardProvider(config as LlamaGuardConfig);
			default:
				throw new AppError(`Unsupported guardrails provider: ${type}`, 400);
		}
	}
}
```

As you can see, this imports two providers, for the bedrock one, we started with this basic boilerplate:

```typescript
import { AwsClient } from 'aws4fetch';

import type { GuardrailsProvider, GuardrailResult } from '../../types';

export interface BedrockGuardrailsConfig {
	guardrailId: string;
	guardrailVersion?: string;
	region?: string;
	accessKeyId: string;
	secretAccessKey: string;
}

export class BedrockGuardrailsProvider implements GuardrailsProvider {
	private aws: AwsClient;
	private guardrailId: string;
	private guardrailVersion: string;
	private region: string;

	constructor(config: BedrockGuardrailsConfig) {
		this.guardrailId = config.guardrailId;
		this.guardrailVersion = config.guardrailVersion || 'DRAFT';
		this.region = config.region || 'us-east-1';

		this.aws = new AwsClient({
			accessKeyId: config.accessKeyId,
			secretAccessKey: config.secretAccessKey,
			region: this.region,
			service: 'bedrock',
		});
	}

  ...
}
```

Within that, we create a function called `validateContent` which is where we make the call to the Guardrail API:

```typescript
	async validateContent(content: string, source: 'INPUT' | 'OUTPUT'): Promise<GuardrailResult> {
		try {
			const url = `https://bedrock-runtime.${this.region}.amazonaws.com/guardrail/${this.guardrailId}/version/${this.guardrailVersion}/apply`;

			const body = JSON.stringify({
				source,
				content: [
					{
						text: {
							text: content,
						},
					},
				],
			});

			const response = await this.aws.fetch(url, {
				method: 'POST',
				headers: {
					'Content-Type': 'application/json',
				},
				body,
			});

			if (!response.ok) {
				const errorText = await response.text();
				throw new Error(`Bedrock Guardrails API error: ${response.statusText} - ${errorText}`);
			}

			const data = (await response.json()) as any;
			const violations: string[] = [];

			if (data.assessments?.[0]) {
				const assessment = data.assessments[0];

				if (assessment.topicPolicy?.topics) {
					violations.push(
						...assessment.topicPolicy.topics
							.filter((topic: any) => topic.action === 'BLOCKED')
							.map((topic: any) => `Blocked topic: ${topic.name}`)
					);
				}

				if (assessment.contentPolicy?.filters) {
					violations.push(
						...assessment.contentPolicy.filters
							.filter((filter: any) => filter.action === 'BLOCKED')
							.map((filter: any) => `Content violation: ${filter.type}`)
					);
				}

				if (assessment.sensitiveInformationPolicy?.piiEntities) {
					violations.push(
						...assessment.sensitiveInformationPolicy.piiEntities
							.filter((entity: any) => entity.action === 'BLOCKED')
							.map((entity: any) => `PII detected: ${entity.type}`)
					);
				}
			}

			return {
				isValid: data.action === 'NONE',
				violations,
				rawResponse: data,
			};
		} catch (error) {
			console.error('Bedrock Guardrails API error:', error);
			throw error;
		}
	}
```

This is uses the `aws4fetch` library to make the request to the Bedrock API, allowing us to call the endpoint from a non AWS service (in this case, Cloudflare Workers).

The response from this API looks like this:

```json
{
    "usage": { 
          "topicPolicyUnits": "integer",
          "contentPolicyUnits": "integer",
          "wordPolicyUnits": "integer",
          "sensitiveInformationPolicyUnits": "integer",
          "sensitiveInformationPolicyFreeUnits": "integer",
          "contextualGroundingPolicyUnits": "integer"
     },
    "action": "GUARDRAIL_INTERVENED" | "NONE",
    "output": [
            // if guardrail intervened and output is masked we return request in same format
            // with masking
            // if guardrail intervened and blocked, output is a single text with canned message
            // if guardrail did not intervene, output is empty array
            {
                "text": "string",
            },
    ],
    "assessments": [{
        "topicPolicy": {
                "topics": [{
                    "name": "string",
                    "type": "DENY",
                    "action": "BLOCKED",
                }]
            },
            "contentPolicy": {
                "filters": [{
                    "type": "INSULTS | HATE | SEXUAL | VIOLENCE | MISCONDUCT |PROMPT_ATTACK",
                    "confidence": "NONE" | "LOW" | "MEDIUM" | "HIGH",
                    "filterStrength": "NONE" | "LOW" | "MEDIUM" | "HIGH",
                "action": "BLOCKED"
                }]
            },
            "wordPolicy": {
                "customWords": [{
                    "match": "string",
                    "action": "BLOCKED"
                }],
                "managedWordLists": [{
                    "match": "string",
                    "type": "PROFANITY",
                    "action": "BLOCKED"
                }]
            },
            "sensitiveInformationPolicy": {
                "piiEntities": [{
                    // for all types see: https://docs.aws.amazon.com/bedrock/latest/APIReference/API_GuardrailPiiEntityConfig.html#bedrock-Type-GuardrailPiiEntityConfig-type
                    "type": "ADDRESS" | "AGE" | ...,
                    "match": "string",
                    "action": "BLOCKED" | "ANONYMIZED"
                }],
                "regexes": [{
                    "name": "string",
                    "regex": "string",
                    "match": "string",
                    "action": "BLOCKED" | "ANONYMIZED"
                }],
            "contextualGroundingPolicy": {
                 "filters": [{
                   "type": "GROUNDING | RELEVANCE",
                   "threshold": "double",
                   "score": "double",
                   "action": "BLOCKED | NONE"
                 }]
            },
            "invocationMetrics": {
                "guardrailProcessingLatency": "integer",
                "usage": {
                    "topicPolicyUnits": "integer",
                    "contentPolicyUnits": "integer",
                    "wordPolicyUnits": "integer",
                    "sensitiveInformationPolicyUnits": "integer",
                    "sensitiveInformationPolicyFreeUnits": "integer",
                    "contextualGroundingPolicyUnits": "integer"
                },
                "guardrailCoverage": {
                    "textCharacters": {
                        "guarded":"integer",
                        "total": "integer"
                    }
                }
            }
        },
        "guardrailCoverage": {
            "textCharacters": {
                "guarded": "integer",
                "total": "integer"
            }
        }
    ]
}
```

We use that to see if the user should be blocked or note, the categories that they violated and the response that we should show them.

And that's really it, you can find my [full implementation here](https://github.com/nicholasgriffintn/assistant/tree/main/src/lib/guardrails).