---
title: "Building a tool to benchmark AI"
date: "2024-12-07T12:18"
updated: "2024-12-07T21:19"
tags: [ai, benchmarks]
description: Simon Willison has been running a [Pelicans on a bicycle](https://simonwillison.net/2024/Oct/25/pelicans-on-a-bicycle/) benchmark against AI for a while now, it's a pretty cool way of seeing how capable different AI models are with a quick outcome.\n\nI've been building my own assistant for a few weeks now but haven't ran any benchmarks against it so I thought I'd do something similar to test my own systems.
image: /uploads/building-a-tool-to-benchmark-ai/featured.png
imageAlt: A screenshot of the tool showing the results of a benchmark.
hideFeaturedImage: true
---

Instead of pelicans on a bicycle, I wanted to change it up just a little bit while allowing for other prompts in the same process.

Enter my new [AI Benchmarks](/ai-benchmarks) tool.

## Result so far

Already I've ran it against to 30 different text based models that my assistant supports, across Gemini, OpenAI, Mistral, Grok, Cluade, Llama, Amazon's new Nova moddels and a few more.

Here are a few of the results that I've found interesting so far:

### Gemini Experimental 1206

![Gemini Experimental 1206](/uploads/building-a-tool-to-benchmark-ai/gemini-experimental-1206.svg)

This one is one of the best results that I've got, however, it's interesting to see that the hamster is floating in the middle of the wheel, this seems to be common.

Gemini also provided a really good explanation of what it did:

```

**Explanation:**

*   **`<svg>` tag:** Defines the SVG canvas with a width and height of 200x150 pixels and sets the viewbox.
*   **`<defs>` tag:** Contains definitions that can be reused, such as the radial gradient for the wheel.
*   **`<radialGradient>`:** Creates a gradient for the wheel to give it a 3D look.
*   **`<circle>`:** Used for the main wheel and the hamster's head.
*   **`<ellipse>`:** Used for the hamster's body.
*   **`<line>`:** Used for the wheel spokes, hamster legs, tail, stand support, and the ground.
*   **`<rect>`:** Used for the base of the wheel stand.
*   **`fill` attribute:** Sets the fill color of shapes.
*   **`stroke` attribute:** Sets the color of the shape's outline.
*   **`stroke-width` attribute:** Sets the thickness of the outline.
*   **`stroke-dasharray`:** Creates a dashed line effect for the wheel bars.
*   **`cx`, `cy`, `rx`, `ry`, `r`:** Attributes that define the position and dimensions of circles and ellipses.
*   **`x1`, `y1`, `x2`, `y2`:** Attributes that define the start and end points of lines.

**Key Features:**

*   **Simplified Style:** The hamster and wheel are depicted in a simplified, cartoonish style.
*   **Wheel Gradient:** The radial gradient adds depth to the wheel.
*   **Mid-Run Pose:** The hamster's legs are positioned to suggest it is running.
*   **Color Palette:** Earthy tones are used to create a natural and warm feel.
```

### Gemini Experimental 1121

You'd probably expect this one to be similar, but it actually took a different approach, this time it's not as complex for the wheel, but it did animate the hamster running.

![Gemini Experimental 1121](/uploads/building-a-tool-to-benchmark-ai/gemini-experimental-1121.svg)

### O1 Preview

As expected, O1 Preview also did a great job, this is definitely the best one out the bunch, and it's animated:

![O1 Preview](/uploads/building-a-tool-to-benchmark-ai/o1-preview.svg)

### The rest of the models

The rest of the models were a mixture of pretty good or similar to Gemini Experimental 1121, however, just not as interesting.

A few didn't respond at all as they thought they were not capable of doing and a couple others just drew some circles.

You can find all of the results of the Hamster SVG benchmark [here](/ai-benchmarks)), I also created a secondary benchmark for the prompt "Create a detailed system design for a scalable web application using AWS.", which you'll find on the same page.

## What's next?

I'll be running these benchmarks against new models that my assistant support over time, I'll probably also add a couple more prompts to test some other capabilities.

AI Gateway also has an API for getting the logs, I think it might be interesting to retrieve these logs and display them on the benchmark.

You can find the script for running the benchmarks [here](https://github.com/nicholasgriffintn/website/blob/main/apps/web/scripts/run-ai-benchmarks.ts), the frontend code is also [here](https://github.com/nicholasgriffintn/website/tree/main/apps/web/app/ai-benchmarks).

