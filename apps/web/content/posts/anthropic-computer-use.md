---
title: "Finally trying out Computer Use from Anthropic"
date: "2024-11-29T20:07"
tags: [anthropic, computer-use, ai]
description: Anthropic released Computer Use quite some time ago but I've not had a chance to try it out just yet, but now that I've tried other things, I figure that it's time to change that and see what it's all about.
image: "/uploads/anthropic-computer-use/featured.png"
imageAlt: "A screenshot showing Anthropic's Computer Use in action"
hideFeaturedImage: true
---

In case you don't already know, Computer Use is available via the [Anthropic API](https://docs.anthropic.com/en/docs/build-with-claude/computer-use) and allows developers to direct Claude to interact with their computer. This includes looking at a screen, moving a mouse, clicking buttons, typing text and more.

It's pretty experimental and error prone at the moment, however, it is very cool.

## Providing the Computer

As Anthropic doesn't provide a hosted virtual machine, you do need to provide your own machine, however, they do provide a Docker image so that you can get started.

It's detailed and provided in the [anthropics/anthropic-quickstarts](https://github.com/anthropics/anthropic-quickstarts/tree/main/computer-use-demo) repo.

To get started with it, run the following command (with Docker Desktop installed):

```bash
export ANTHROPIC_API_KEY=%your_api_key%
docker run \
    -e ANTHROPIC_API_KEY=$ANTHROPIC_API_KEY \
    -v $HOME/.anthropic:/home/computeruse/.anthropic \
    -p 5900:5900 \
    -p 8501:8501 \
    -p 6080:6080 \
    -p 8080:8080 \
    -it ghcr.io/anthropics/anthropic-quickstarts:computer-use-demo-latest
```

This will start a web UI with the chat and desktop interface at `http://localhost:8080`, alongside these other entry points:

- Streamlit interface only: http://localhost:8501
- Desktop view only: http://localhost:6080/vnc.html
- Direct VNC connection: vnc://localhost:5900 (for VNC clients)

## Chatting with Claude

As described in the [Anthropic API docs](https://docs.anthropic.com/en/docs/build-with-claude/computer-use), the chat interface works like this:

- The user provides a prompt to the Computer Use interface
- Claude will receive that prompt and then decide on the tool that it will use to complete the request, it loads a set of pre-defined definitions and then assesses which tool would help best to complete the query.
- The Computer Use tool will then extract the tool input, evaluate the tool on the computer and then return the results to the user.
- The tool will continue to do this until it has decided that it has completed the task.

You can also combine the computer use tools alongside of tools which you might have previously created for other AI requests.

But while using it, it is important to remember that there are [limitations](https://docs.anthropic.com/en/docs/build-with-claude/computer-use#understand-computer-use-limitations) with Computer Use, including that you should take precautions to isolate Claude from any sensitive data or actions, given that prompt injection attacks are possible.

## Trying it out

There are a whole bunch of things that you can do with this, but to start, I thought a standard task that I might do on the internet and get an automated response from might be to chat what the latest goings on are in Hacker News and get a summarised output.

To do that, I entered the following prompt:

```
Navigate to Hacker News, find the top news and then create a report for me that summarises the latest goings on and the overall sentiment of them.
```

Here's a video of it in progress:

<video width="100%" video="100%" controls>
  <source src="https://assets.nickgriffin.uk/computer-use-1.mp4" type="video/mp4" />
Your browser does not support the video tag.
</video>

And here's the output:

```markdown
Now that I have access to Hacker News, let me analyze the top stories and create a summary report for you.

Hacker News Top Stories Report - November 29, 2024

Top Stories Analysis:

Technical Infrastructure & Development:
"Why pipes sometimes get 'stuck': buffering" (184 points) - A technical discussion about system-level programming and I/O buffering issues.
"Llama.cpp guide – Running LLMs locally on any hardware" (160 points) - Showing continued interest in local AI deployment and democratization of AI technology.
"Borgo Programming Language" - A new programming language development, indicating ongoing interest in language design.
Technology Industry & Business:
"Engineers do not get to make startup mistakes when they build ledgers" - Discussion about financial technology and startup development practices.
"Core copyright violation moves ahead in The Intercept's lawsuit against OpenAI" - Highlighting ongoing tensions between media organizations and AI companies.
"Sieve (YC W22) Is Hiring Engineers" - Showing continued growth in the video AI sector.
Economic & Social Impact:
"US house prices in 1950 vs. 2024, accounting for inflation" - Economic analysis trending, showing community interest in long-term economic trends.
"Buy Nothing Day" - Discussion about consumer culture and anti-consumerism movement.
"The Influence of Bell Labs" - Historical technology perspective getting attention.
Scientific & Research:
"Chinese pebble-bed nuclear reactor passes 'meltdown' test" - Advancement in nuclear technology.
"ClearR: Robust and Generalized Parameter-Efficient Fine-Tuning for Noisy Labels" - AI/ML research development.
Overall Sentiment Analysis:

Technical Focus: Strong emphasis on practical technical content, especially around systems programming and AI deployment.

Critical Discussion: The community appears particularly engaged with:

Infrastructure challenges (pipes, systems)
AI development and its implications (Llama.cpp, OpenAI lawsuit)
Economic issues (housing prices, consumer culture)
Industry Trends:
Continued strong interest in AI and machine learning
Focus on practical implementation rather than just theoretical discussions
Growing attention to infrastructure and system-level challenges
Concerns:
Legal/ethical implications of AI (copyright issues)
Economic disparities (housing prices)
Technical debt and system design
The overall tone is technically focused with a healthy mix of practical implementation discussions and broader industry implications. There's a noticeable theme of democratization of technology (especially regarding AI) and concern about economic and social impacts of technical decisions.

Community engagement appears highest with:

Technical tutorials and guides
Economic analysis
AI/ML developments
Infrastructure discussions
This snapshot shows a community primarily focused on practical technical content while maintaining awareness of broader industry and societal implications of technology.
```

Next I thought, maybe we should try something a bit more complex, solve today's Wordle puzzle. Not only is this tricky because it's a game, but also it requires knowledge that the game is on he NYT website, the website has not one but two (yes two) privacy models and asks if you want to sign in.

I started with a simple prompt just to see what would happen:

```
Solve today's Wordle puzzle.
```

<video width="100%" video="100%" controls>
  <source src="https://assets.nickgriffin.uk/computer-use-wordle.mp4" type="video/mp4" />
Your browser does not support the video tag.
</video>

So yeah, as expected, that didn't work, the privacy notice on top of the privacy notice was just a little too much for it to work out, so much so that I ended up hitting a rate limit.

So I manually accepted the privacy notices (you can enable the mouse and keyboard to do this) and then tried again with the same prompt. It tried about 4 time initially, and it got stuck (I think the ad was in the way), so I scrolled down the page and let it continue, that then lead it to think that it had succeeded, which it hadn't:

![Wordle](/uploads/anthropic-computer-use/wordle.png)

I let it know that it wasn't correct:

```
That doesn't seem correct...
```

It got confused again, opened a private tab for some reason and then I got rate limited again. So I think I'm ready to concluded that there.

## Thoughts

All in all, it's definitely a cool tool and there are going to be lots of really cool stuff but I wonder if the effort that's going to be required is really going to be worth it in the long run, the web is built for humans not machines and there are a lot of things out there are not going to be easy to understand for a machine.

Alongside that, it's pretty slow at the moment and seems to use a ton of tokens to do that. It also get confused often and seems like a lot of manual intervention is required to get it to do what you want it to do.

According to the dashboard, this cost me $0.67.

That said, it is currently experimental, the hope would be that it is going to become far more advanced over time.