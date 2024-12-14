---
title: 'Monitoring AI performance with Cloudflare Analytics Engine'
date: '2024-12-14T17:45'
tags: [ai, cloudflare, cloudflare-analytics-engine, performance, monitoring]
description: Back in 2022 (yes that long ago), Cloudflare announced a new product called the Workers Analytics Engine. This tool is the same that Cloudflare already uses for their own analytics measurement but expanded so that it can be used elsewhere.\nI've been meaning to use this for a while now, and finally got around to it.
image: /uploads/monitoring-performance-with-cloudflare-analytics-engine/featured.png
imageAlt: A screenshot of the frontend I built to show the performance of models used with my AI assistant.
hideFeaturedImage: true
---

## What is Workers Analytics Engine?

While I'm going to using the tool for performance and usage monitoring of my AI assistant, Workers Analytics Engine is actually pretty expansive for a whole range of things.

The main advantage of this tool is that it is built for high-volume, low-latency metric collections, which makes it super useful for adding analytics to applications that are running in serverless environments or where you don't want to block the response time of your application.

It does have some limits though:

- You can only send 20 blobs or doubles per request.
- The total size of all blobs cannot be higher than 5120 bytes.
- The total size of the index cannot be more than 96 bytes.
- A single Worker invocation can only write 25 data points.

But for my use case, this is all fine.

It should also be noted that data is only stored for 3 months, so if you wanted to use this for long term analytics, you'd need to stream it off to a different service.

## How I'm using it

For my implementation, I'm looking to track the latency of the responses from models used with my AI assistant, this would include the settings used in the request alongside the usage metrics that the model returns in the response.

### Tracking metrics

To start, I added the following to my `wrangler.toml` file, which creates a binding to Analytics Engine for workers.

```toml
[[analytics_engine_datasets]]
binding = "ANALYTICS"
dataset = "assistant_analytics"
```

Next up, I created a new class that could be used around my app to track metrics:

```typescript
export class Monitoring {
	private static instance: Monitoring;
	private metrics: Metric[] = [];
	private analyticsEngine: AnalyticsEngineDataset;

	private constructor(analyticsEngine?: AnalyticsEngineDataset) {
		if (!analyticsEngine) {
			throw new AssistantError("Analytics Engine not configured");
		}

		this.analyticsEngine = analyticsEngine;
	}

	public static getInstance(
		analyticsEngine?: AnalyticsEngineDataset,
	): Monitoring {
		if (!Monitoring.instance) {
			Monitoring.instance = new Monitoring(analyticsEngine);
		}
		return Monitoring.instance;
	}
	...
}
```

Within this, we have a `recordMetric` method that will validate the metric and then add it to the list of metrics.

```typescript
	...
	public recordMetric(metric: Metric): void {
		if (!this.validateMetric(metric)) {
			console.warn("Invalid metric structure:", metric);
			return;
		}

    this.analyticsEngine.writeDataPoint({
      blobs: [
        metric.type,
        metric.name,
        metric.status,
        metric.error || "None",
        metric.traceId,
        JSON.stringify(metric.metadata),
      ],
      doubles: [metric.value, metric.timestamp],
      indexes: [metric.traceId],
    });
	}

	private validateMetric(metric: Metric): boolean {
		return (
			typeof metric.traceId === "string" &&
			typeof metric.timestamp === "number" &&
			["performance", "error", "usage"].includes(metric.type) &&
			typeof metric.name === "string" &&
			typeof metric.value === "number"
		);
	}
	...
```

With the values in place instead of variables, writing data points looks like this:

```typescript
analyticsEngine.writeDataPoint({
  blobs: ['performance', 'ai_response', 'success', 'None', 'id', '{"model": "gpt-4o-mini"}'],
  doubles: [78, 1718289600],
  indexes: ['id']
});
```

There are a couple of important things to note about `writeDataPoint`:

- It will return immediately as the runtime will handle the writing of the data point in the background, so there's no need to add anything on top or await the response.
- Blobs can only be a list of strings, so that's why I'm using `JSON.stringify` to convert the metadata object to a string.
  - These need to be provided in a consistent order.
- Doubles can only be a list of numbers.
- While indexes is an array, it can only contain one item, alongside this, it should be noted that this will be used as a [sampling key])https://developers.cloudflare.com/analytics/analytics-engine/sql-api/#sampling).

You can [find the full implementation here](https://github.com/nicholasgriffintn/assistant/blob/main/src/lib/monitoring.ts).

### Getting metric data

Next up, I wanted to create a new API route that would allow me to filter and get metrics that have been written to the dataset.

This API will take a number of query string parameters which would then be used to build an SQL query like so:

```typescript
  const buildQuery = () => {
		let baseQuery = `
        SELECT 
            blob1 as type,
            blob2 as name,
            blob3 as status,
            blob4 as error,
            blob5 as traceId,
						blob6 as metadata,
            double1 as value,
            timestamp,
						toStartOfInterval(timestamp, INTERVAL '${queryOptions.interval}' MINUTE) as truncated_time,
						SUM(_sample_interval) as sampleCount
        FROM assistant_analytics
        WHERE timestamp > now() - INTERVAL '${queryOptions.timeframe}' HOUR
        `;

		if (options.type) {
			baseQuery += ` AND blob1 = '${options.type}'`;
		}

		if (options.status) {
			baseQuery += ` AND blob3 = '${options.status}'`;
		}

		baseQuery += `
        GROUP BY 
            blob1, blob2, blob3, blob4, blob5, blob6,
            double1, timestamp
        ORDER BY timestamp DESC
        LIMIT ${queryOptions.limit}
        `;

		return baseQuery;
	};
```

Then, unfortunately, Cloudflare doesn't provide a binding method for querying like they do for writing, so we have to call an API instead, this is done like so:

```typescript
const query = buildQuery();
const response = await fetch(
  `https://api.cloudflare.com/client/v4/accounts/${env.ACCOUNT_ID}/analytics_engine/sql?query=${encodeURIComponent(query)}`,
  {
    method: "GET",
    headers: {
      Authorization: `Bearer ${env.ANALYTICS_API_KEY}`,
    },
  },
);
```

You can find out more about how this works in [Cloudflare's documentation here](https://developers.cloudflare.com/analytics/analytics-engine/sql-api/).

You should also note the [supported functions that can be used in the query](https://developers.cloudflare.com/analytics/analytics-engine/sql-reference/#supported-functions), while building mine, I had to go through a few iterations to get the output that I wanted.

In the end, the response looks like this:

```json
{
  "metrics": [
    {
      "type": "performance",
      "name": "ai_provider_response",
      "status": "success",
      "error": "None",
      "traceId": "ba4bb7e5-f6f8-4647-9751-64208160a3fa",
      "metadata": "{\"provider\":\"github-models\",\"model\":\"Phi-3.5-MoE-instruct\",\"latency\":13606,\"tokenUsage\":{\"completion_tokens\":157,\"prompt_tokens\":350,\"total_tokens\":507},\"logId\":null,\"settings\":{}}",
      "value": 13606,
      "timestamp": "2024-12-14 18:02:49",
      "truncated_time": "2024-12-14 18:00:00",
      "sampleCount": "1",
      "minutesAgo": 45
    },
    {
      "type": "performance",
      "name": "ai_provider_response",
      "status": "success",
      "error": "None",
      "traceId": "07b6093a-aa36-4ed8-8b21-d0d8181e6b85",
      "metadata": "{\"provider\":\"github-models\",\"model\":\"Phi-3.5-MoE-instruct\",\"latency\":11974,\"tokenUsage\":{\"completion_tokens\":130,\"prompt_tokens\":350,\"total_tokens\":480},\"logId\":null,\"settings\":{}}",
      "value": 11974,
      "timestamp": "2024-12-14 18:02:18",
      "truncated_time": "2024-12-14 18:00:00",
      "sampleCount": "1",
      "minutesAgo": 45
    }
  ]
}
```

I also added usage tracking, which when queried, looks like this:

```json
{
  "metrics": [
    {
      "type": "usage",
      "name": "user_usage",
      "status": "success",
      "error": "None",
      "traceId": "a660ee20-d02e-488d-a2cd-020c0df21554",
      "metadata": "{\"userId\":\"nick@undefined.computer\"}",
      "value": 1,
      "timestamp": "2024-12-14 18:02:06",
      "truncated_time": "2024-12-14 18:00:00",
      "sampleCount": "1",
      "minutesAgo": 46
    }
  ]
}
```

As noted before, as you have to keep the same order and names for the blobs, when adding more metrics, you'll need to build them around the same structure, so it's important to keep this in mind when you create your first one.

### Frontend

Finally, I wanted to tie this all together with a frontend that would allow me to see the performance of the assistant over time.

![A screenshot of the frontend I built to show the performance of models used with my AI assistant.](/uploads/monitoring-performance-with-cloudflare-analytics-engine/featured.png)

I've made this publicly available since it doesn't contain any sensitive data, you can [see it here](https://nicholasgriffin.dev/ai-metrics).

You should note though: I haven't finished cost, caching or error tracking properly yet, so, at the time of writing, these are going to be wrong.

If you're interested, you can [find the code for the frontend here](https://github.com/nicholasgriffintn/website/tree/main/apps/web/app/ai-metrics).
