import { ChatModel } from '@/types/chat';

export const defaultModel = 'hermes-2-pro-mistral-7b';

// NOTE: Compatible Web LLM models can be found here: https://github.com/mlc-ai/web-llm/blob/main/src/config.ts#L311
export const modelsOptions: ChatModel[] = [
  {
    id: 'hermes-2-pro-mistral-7b',
    name: 'Hermes 2 Pro - Mistral 7B',
    description:
      'Hermes 2 Pro on Mistral 7B is the new flagship 7B Hermes! Hermes 2 Pro is an upgraded, retrained version of Nous Hermes 2, consisting of an updated and cleaned version of the OpenHermes 2.5 Dataset, as well as a newly introduced Function Calling and JSON Mode dataset developed in-house.',
    capabilities: ['function-calling', 'text-generation'],
  },
  {
    id: 'llama-3.2-3b-instruct',
    name: 'Llama 3.2 - 3B Instruct',
    description:
      'The Llama 3.2 instruction-tuned text only models are optimized for multilingual dialogue use cases, including agentic retrieval and summarization tasks.',
    capabilities: ['text-generation'],
  },
  {
    id: 'claude-3-5-sonnet',
    name: 'Claude 3.5 - Sonnet (Anthropic)',
    description:
      'Claude 3.5 Sonnet can understand nuanced instructions and context, recognize and correct its own mistakes, and can create sophisticated analysis and insights from complex data. Combined with state-of-the-art coding, vision, and writing skills, you can use Claude 3.5 Sonnet for a variety of use cases.',
    capabilities: [
      'text-generation',
      'code-generation',
      'computer-use',
      'vision',
    ],
  },
  {
    id: 'llama-3.1-sonar-small-128k-online',
    name: 'Llama 3.1 - Sonar Small 128k Online (Perplexity)',
    description:
      'Offers fast, precise processing for interactive applications, ensuring high-quality, fact-based responses ideal for dynamic environments requiring online timely information.',
    capabilities: ['text-generation'],
  },
  {
    id: 'grok',
    name: 'Grok',
    description:
      'Comparable performance to Grok 2 but with improved efficiency, speed and capabilities.',
    capabilities: ['text-generation', 'code-generation'],
  },
  {
    id: 'sqlcoder',
    name: 'SQLCoder',
    description:
      'SQLCoder is a model trained on SQL queries and their corresponding natural language descriptions. It can generate SQL queries from natural language descriptions and vice versa.',
    capabilities: ['code-generation'],
  },
  {
    id: 'deepseek-coder-6.7b',
    name: 'DeepSeek Coder 6.7B',
    description:
      'Deepseek Coder is composed of a series of code language models, each trained from scratch on 2T tokens, with a composition of 87% code and 13% natural language in both English and Chinese.',
    capabilities: ['code-generation'],
  },
  {
    id: 'stable-diffusion-xl-lightning',
    name: 'Stable Diffusion XL Lightning',
    description:
      'SDXL-Lightning is a lightning-fast text-to-image generation model. It can generate high-quality 1024px images in a few steps.',
    capabilities: ['text-to-image'],
  },
  {
    id: 'flux',
    name: 'Flux',
    description:
      'FLUX.1 [schnell] is a 12 billion parameter rectified flow transformer capable of generating images from text descriptions.',
    capabilities: ['text-to-image'],
  },
  {
    id: 'stable-diffusion-xl-base-1.0',
    name: 'Stable Diffusion XL Base 1.0',
    description:
      'Diffusion-based text-to-image generative model by Stability AI. Generates and modify images based on text prompts.',
    capabilities: ['text-to-image'],
  },
  {
    id: 'claude-3.5-haiku',
    name: 'Claude 3.5 - Haiku (Anthropic)',
    description:
      'With fast speeds, improved instruction following, and more accurate tool use, Claude 3.5 Haiku is well suited for user-facing products, specialized sub-agent tasks, and generating personalized experiences from huge volumes of data.',
    capabilities: [
      'text-generation',
      'code-generation',
      'labelling',
      'moderation',
    ],
  },
  {
    id: 'claude-3.5-opus',
    name: 'Claude 3.5 - Opus (Anthropic)',
    description:
      'The Claude 3.5 Opus is an advanced AI model by Anthropic designed for enterprise-level applications. It offers unmatched performance in handling complex tasks, making it an ideal solution for businesses requiring high-level data processing and analysis.',
    capabilities: ['text-generation', 'code-generation'],
  },
  {
    id: 'llama-3.1-sonar-large-128k-online',
    name: 'Llama 3.1 - Sonar Large 128k Online (Perplexity)',
    description:
      'Offers fast, precise processing for interactive applications, ensuring high-quality, fact-based responses ideal for dynamic environments requiring online timely information.',
    capabilities: ['text-generation'],
  },
  {
    id: 'llama-3.1-sonar-huge-128k-online',
    name: 'Llama 3.1 - Sonar Huge 128k Online (Perplexity)',
    description:
      'Offers fast, precise processing for interactive applications, ensuring high-quality, fact-based responses ideal for dynamic environments requiring online timely information.',
    capabilities: ['text-generation'],
  },
  {
    id: 'openchat',
    name: 'OpenChat',
    description:
      'OpenChat is an innovative library of open-source language models, fine-tuned with C-RLFT - a strategy inspired by offline reinforcement learning.',
    capabilities: ['text-generation'],
  },
  {
    id: 'phi-2',
    name: 'Phi 2',
    description:
      'Phi-2 is a Transformer-based model with a next-word prediction objective, trained on 1.4T tokens from multiple passes on a mixture of Synthetic and Web datasets for NLP and coding.',
    capabilities: ['text-generation'],
  },
  {
    id: 'tinyllama',
    name: 'TinyLlama',
    description:
      'The TinyLlama project aims to pretrain a 1.1B Llama model on 3 trillion tokens. This is the chat model finetuned on top of TinyLlama/TinyLlama-1.1B-intermediate-step-1431k-3T.',
    capabilities: ['text-generation'],
  },
  {
    id: 'una-cybertron-7b-v2',
    name: 'Una Cybertron 7B V2',
    description:
      "Cybertron 7B v2 is a 7B MistralAI based model, best on it's series. It was trained with SFT, DPO and UNA (Unified Neural Alignment) on multiple datasets.",
    capabilities: ['text-generation'],
  },
  {
    id: 'llama-3.1-70b-instruct',
    name: 'Llama 3.1 - 70B Instruct',
    description:
      'The Meta Llama 3.1 collection of multilingual large language models (LLMs) is a collection of pretrained and instruction tuned generative models. The Llama 3.1 instruction tuned text only models are optimized for multilingual dialogue use cases and outperform many of the available open source and closed chat models on common industry benchmarks.',
    capabilities: ['text-generation'],
  },
  {
    id: 'llama-3.2-1b-instruct',
    name: 'Llama 3.2 - 1B Instruct',
    description:
      'The Llama 3.2 instruction-tuned text only models are optimized for multilingual dialogue use cases, including agentic retrieval and summarization tasks.',
    capabilities: ['text-generation'],
  },
  {
    id: 'mistral-nemo',
    name: 'Mistral Nemo (Hugging Face)',
    description:
      'The Mistral-Nemo-Instruct-2407 Large Language Model (LLM) is an instruct fine-tuned version of the Mistral-Nemo-Base-2407. Trained jointly by Mistral AI and NVIDIA, it significantly outperforms existing models smaller or similar in size.',
    capabilities: ['text-generation'],
  },
  {
    id: 'smollm2-1.7b-instruct',
    name: 'SmolLM2 - 1.7B Instruct (Hugging Face)',
    description:
      'SmolLM2 1.7B has various enhancements in instruction following, knowledge, reasoning, and mathematics. It was trained on 11 trillion tokens using a diverse dataset combination: FineWeb-Edu, DCLM.',
    capabilities: ['text-generation'],
  },
  {
    id: 'gemini-experimental',
    name: 'Gemini Experimental (OpenRouter)',
    description:
      'An experimental release (November 21st, 2024) of Google Gemini.',
    capabilities: ['text-generation'],
  },
  {
    id: 'Llama-3.2-1B-Instruct-q4f32_1-MLC',
    name: 'Llama 3.2 1B Instruct (Q4F32)',
    description: 'Quantized Llama 3.2 1B model optimized for web browsers',
    capabilities: ['text-generation'],
    isLocal: true,
  },
  {
    id: 'Llama-3.2-3B-Instruct-q4f32_1-MLC',
    name: 'Llama 3.2 3B Instruct (Q4F32)',
    description: 'Quantized Llama 3.2 3B model optimized for web browsers',
    capabilities: ['text-generation'],
    isLocal: true,
  },
  {
    id: 'Llama-3.1-8B-Instruct-q4f32_1-MLC',
    name: 'Llama 3.1 8B Instruct (Q4F32)',
    description: 'Quantized Llama 3.1 8B model optimized for web browsers',
    capabilities: ['text-generation'],
    isLocal: true,
  },
  {
    id: 'Mistral-7B-Instruct-v0.3-q4f16_1-MLC',
    name: 'Mistral 7B Instruct v0.3 (Q4F16)',
    description: 'Latest Mistral 7B v0.3 model optimized for web browsers',
    capabilities: ['text-generation'],
    isLocal: true,
  },
  {
    id: 'gemma-2-2b-it-q4f32_1-MLC',
    name: 'Gemma 2 2B IT (Q4F32)',
    description: "Google's Gemma 2B instruction-tuned model",
    capabilities: ['text-generation'],
    isLocal: true,
  },
  {
    id: 'gemma-2-9b-it-q4f32_1-MLC',
    name: 'Gemma 2 9B IT (Q4F32)',
    description: "Google's Gemma 9B instruction-tuned model",
    capabilities: ['text-generation'],
    isLocal: true,
  },
  {
    id: 'SmolLM2-1.7B-Instruct-q4f16_1-MLC',
    name: 'SmolLM2 1.7B Instruct (Q4F16)',
    description: 'Efficient small language model optimized for web browsers',
    capabilities: ['text-generation'],
    isLocal: true,
  },
  {
    id: 'TinyLlama-1.1B-Chat-v1.0-q4f16_1-MLC',
    name: 'TinyLlama 1.1B Chat v1.0 (Q4F16)',
    description: 'Efficient tiny language model optimized for web browsers',
    capabilities: ['text-generation'],
    isLocal: true,
  },
];
