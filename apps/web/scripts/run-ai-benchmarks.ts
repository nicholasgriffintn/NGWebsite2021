// @ts-nocheck
import fs from 'node:fs';

const RATE_LIMIT = 50;
const TIME_WINDOW = 5 * 60 * 1000;
const DELAY_BETWEEN_REQUESTS = Math.ceil(TIME_WINDOW / RATE_LIMIT);

const sleep = (ms: number) => new Promise((resolve) => setTimeout(resolve, ms));

function validateBenchmarkResponse(benchmark: any, response: any) {
  if (!response) return { status: 'failed', reason: 'No response received' };

  if (benchmark.id === 'hamster-svg') {
    const messages = Array.isArray(response)
      ? response
      : response.response || [];

    const hasSvgTags = messages.some((message) => {
      const content = message.content || '';
      return content.includes('<svg') && content.includes('</svg>');
    });

    return {
      status: hasSvgTags ? 'success' : 'failed',
      reason: hasSvgTags ? null : 'No valid SVG tags found in response',
    };
  }

  return { status: 'success', reason: null };
}

async function fetchModelResponse(model: string, benchmark: any) {
  const request = {
    chatId: `benchmark-v1.1-${benchmark.id}-${model}`,
    message: benchmark.prompt,
    model,
    mode: 'no_system',
    role: 'user',
    max_tokens: 4096,
    timestamp: new Date().toISOString(),
  };

  const baseUrl = 'https://assistant.nicholasgriffin.workers.dev';
  const token = process.env.AUTH_TOKEN;

  console.log(`Fetching data for ${request.chatId}`);

  try {
    const response = await fetch(`${baseUrl}/chat`, {
      method: 'POST',
      headers: {
        'Content-Type': 'application/json',
        'User-Agent': 'NGWeb',
        Authorization: `Bearer ${token}`,
      },
      body: JSON.stringify({
        chat_id: request.chatId,
        input: model === 'flux' ? { prompt: request.message } : request.message,
        date: request.timestamp,
        model: model,
        mode: request.mode,
        max_tokens: request.max_tokens,
        role: request.role,
      }),
    });

    if (!response.ok) {
      console.error(
        `Error fetching data for ${request.chatId}:`,
        response.statusText
      );
      return {
        model,
        request,
        response: null,
        status: 'failed',
        reason: `HTTP ${response.status}: ${response.statusText}`,
      };
    }

    const responseData = await response.json();
    const validation = validateBenchmarkResponse(benchmark, responseData);

    return {
      model,
      request,
      response: responseData,
      ...validation,
    };
  } catch (error) {
    return {
      model,
      request,
      response: null,
      status: 'failed',
      reason: `Error: ${error.message}`,
    };
  }
}

async function processBatchWithRateLimit(models: string[], benchmark: any) {
  const results = [];
  const batchSize = 3;

  for (let i = 0; i < models.length; i += batchSize) {
    const batch = models.slice(i, i + batchSize);

    const batchResults = await Promise.all(
      batch.map((model) => fetchModelResponse(model, benchmark))
    );
    results.push(...batchResults);

    if (i + batchSize < models.length) {
      await sleep(DELAY_BETWEEN_REQUESTS);
    }
  }

  return results;
}

async function run() {
  try {
    const benchmarks = [
      {
        id: 'hamster-svg',
        prompt: 'Generate an SVG of a hamster running on a wheel',
        description:
          'A standardised test to see how well LLMs can generate SVGs. Note: For all of these, I keep the conversation going until the model provides a useable SVG, even if that SVG is blank.',
      },
      {
        id: 'system-design',
        prompt:
          'Create a detailed system design for a scalable web application using AWS.',
        description:
          'A standardised test to see how well LLMs can create detailed system designs, while also testing its knowledge.',
      },
    ];

    const models = [
      'gemini-experimental-1121',
      'gemini-experimental-1206',
      'gemini-1.5-flash',
      'gemini-1.5-pro',
      'gemini-1.5-flash-8b',
      'o1-preview',
      'o1-mini',
      'gpt-4o',
      'gpt-4o-mini',
      'gpt-4-turbo',
      'gpt-4',
      'gpt-3.5-turbo',
      'mistral-large',
      'mistral-small',
      'nova-lite',
      'nova-micro',
      'nova-pro',
      'claude-3.5-sonnet',
      'claude-3.5-haiku',
      'claude-3-opus',
      'grok',
      'llama-3.1-70b-instruct',
      'llama-3.2-1b-instruct',
      'llama-3.2-3b-instruct',
      'mistral-nemo',
      'llama-3.1-sonar-small-128k-online',
      'codestral',
      'openchat',
      'una-cybertron-7b-v2',
      'tinyllama',
    ];

    const existingBenchmarks = JSON.parse(
      fs.readFileSync('./lib/data/ai-benchmarks.json', 'utf8')
    );

    const newBenchmarkData = await Promise.all(
      benchmarks.map(async (benchmark) => {
        const existingBenchmark = existingBenchmarks.find(
          (existing) => existing.prompt === benchmark.prompt
        );

        if (existingBenchmark) {
          const successfulModelIds = existingBenchmark.models
            .filter((m) => m.status === 'success')
            .map((m) => m.model);

          const modelsToRun = models.filter(
            (m) => !successfulModelIds.includes(m)
          );

          const newModelData = await processBatchWithRateLimit(
            modelsToRun,
            benchmark
          );

          return {
            ...existingBenchmark,
            models: [...existingBenchmark.models, ...newModelData],
          };
        }

        const modelData = await processBatchWithRateLimit(models, benchmark);

        return {
          ...benchmark,
          models: modelData,
        };
      })
    );

    fs.writeFileSync(
      './lib/data/ai-benchmarks.json',
      JSON.stringify(newBenchmarkData, null, 2)
    );
  } catch (error) {
    console.error('Failed to run benchmarks:', error);
  }
}

run();
