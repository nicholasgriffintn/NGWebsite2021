---
title: "Building My Own A/B Testing Platform"
description: "Creating an A/B testing platform from scratch was a unique challenge. I wanted to build a tool capable of running both Bayesian and frequentist experiments, that provided a decent foundation to build more from, but a bit scrappy to keep it as a side project. This post walks through the development journey—from the initial concept to key design decisions and the hurdles faced along the way."
date: "2024-10-27T13:12"
image: "/uploads/building-my-own-ab-testing-platform/main.png"
imageAlt: "A screenshot showing the initial interface on the left and a view of the app running on the right."
hideFeaturedImage: true
---

## Getting Started: Defining Project Requirements

The goal was to build a scalable and flexible A/B testing platform with a modular architecture. Early on, I listed several core features that I wanted the platform to support:

- Bayesian and Frequentist Testing: Including both options provides flexibility in analysis, which was essential for versatility.
- Sequential Testing and Multiple Testing Corrections: I wanted to ensure statistical rigor, even for complex testing scenarios.
- User Bucketing and Plotting: Segmenting users and visualizing results would improve usability and reporting.

## Choosing the Tech Stack

To keep dependencies manageable and ensure ease of setup, I chose [Poetry](https://python-poetry.org/) for dependency management and [Tox](https://tox.wiki/en/4.23.2/) for testing automation​. The CLI is built using a basic command-line interface setup, allowing users to execute tests directly from their terminals, which I found ideal for scripting automated test runs. 

Additionally, a lightweight [FastAPI](https://fastapi.tiangolo.com/) framework powers the web interface, providing a way to visualize data and interact with experiments.

## Core Development Phases

### 1. Building the CLI

I started by constructing a command-line interface that would serve as the backbone for experiment setup and execution. Using Python, I structured the CLI to accept various commands and arguments, making it possible to create tests, load data, and run analyses. This approach made the tool adaptable for users who prefer working from the terminal.

### 2. Developing Bayesian and Frequentist Testing Modules

Implementing Bayesian and frequentist testing options involved creating separate modules for each statistical method. Each module:

- Bayesian Module: Uses a prior distribution approach and updates based on observed data.
- Frequentist Module: Uses a more traditional hypothesis testing approach with significance testing. The biggest challenge here was ensuring accuracy in calculations and optimizing them for speed. I wrote unit tests to verify each module’s reliability, which also made debugging easier as the project evolved.

### 3. Implementing User Bucketing and Sequential Testing

With the testing logic established, I focused on user bucketing. I wanted to ensure that users could be split into test groups using various strategies (randomized, fixed, etc.), so I implemented an initial bucketing function that supports these options. The sequential testing feature allows for stopping tests early when significance is reached, which I achieved by running interim checks on test data.

### 4. Adding Multiple Testing Corrections

One key functionality for this platform is handling multiple testing scenarios. I incorporated corrections like Bonferroni and Benjamini-Hochberg to reduce the chance of false positives. This feature allows the platform to maintain accuracy when running numerous tests simultaneously—a common challenge in data-driven environments.

## Building the Web Interface

After establishing core functionalities, I added a web interface using FastAPI. This interface provides a dashboard to:

- Run Tests: Users can set up and start tests directly from their browser.
- Visualize Results: Using built-in plotting tools, users can track test progress and outcomes in real-time.

The web interface brought the project together, making the platform more accessible and engaging, especially for users who prefer a GUI over CLI interactions.

![A screenshot showing the initial interface on the left and a view of the app running on the right.](/uploads/building-my-own-ab-testing-platform/main.png)
*The A/B testing platform interface, showing the initial setup and a running test.*

## Challenges and Next Steps

Developing this platform taught me a lot about the complexity of A/B testing, especially regarding statistical rigor and scaling challenges. Some of the main challenges included optimizing sequential testing for speed and ensuring the platform could handle large-scale tests efficiently.

Looking ahead, I plan to expand the plotting capabilities and add more user-friendly features, like custom result filters and additional visualization options.

## Check Out the Code

If you're interested in exploring the codebase or contributing to the project, you can find the repository [here](https://github.com/nicholasgriffintn/ab-testing-platform). Feel free to reach out with any questions or feedback — I'm always open to collaboration and new ideas!