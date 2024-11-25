---
title: "Mistral has released their new multimodal model, Pixtral Large"
date: "2024-11-25T21:51"
tags: [mistral, pixtral, multimodal, ai]
description: Something pretty cool happened last week, Mistral released their new multimodal model, Pixtral Large. Built on top of Mistral Large 2, it is a new, 124B open-weights model that is capable of understanding documents, charts and natural images according to Mistral. Not only that, but it also supports the functionality of the Mistral Large 2 model.
---

What's particularly interesting about this and other models from Mistral is that the weights are [available to download right from Huggingface](https://huggingface.co/mistralai/Pixtral-Large-Instruct-2411), available under the Mistral Research License which is free for research and educational use, as well as the Mistral Commercial License for commercial use.

According to Mistral, it's also super capable. Through their MathVista testing harness, they found that the new model achieved 69.4%, which they say is much higher that other, similar models.

They also tested it on MM-MT-Bench, they claim it even outperformed Claude-3.5 Sonnet from these results.

Here are some images from the Mistral blog post:

![](https://mistral.ai/images/news/pixtral-large/pixtral-large-main-table.png)

![](https://mistral.ai/images/news/pixtral-large/pixtral-large-header-fig.png)

You can also check out the [Mistral blog post](https://mistral.ai/news/pixtral-large/) for more information, and if you need a bit more info, you can [find that here](https://docs.mistral.ai/capabilities/vision/).

## Trying it out myself

Of course, after all that, I had to give it a go.

### Charts

Let's start with a chart, I thought I'd try a relatively complex one, this is showing the constituency winners from the 2024 General Election in the UK, what makes it complex is that it isn't identifying the boundaries.

![The results of the General Election 2024, showing the distribution of constituency winners across the United Kingdom. The image is divided into two maps: a hex map and a geographical map.](https://assistant-assets.nickgriffin.uk/uploads/82a2eee9-001b-4e70-9bfa-7c5179b4c03b.png)
([Image source](https://commonslibrary.parliament.uk/research-briefings/cbp-10009/))

I sent this over with a simple Curl command:

```bash
curl --request POST \
  --url https://api.mistral.ai/v1/chat/completions \
  --header 'Accept: application/json' \
  --header 'Authorization: Bearer $MISTRAL_API_KEY' \
  --header 'Content-Type: application/json' \
  --data '{
  "model": "pixtral-large-latest",
  "messages": [
    {
      "role": "user",
      "content": [
        {
          "type": "text",
          "text": "Analyse this chart from the UK general election"
        },
        {
          "type": "image_url",
          "image_url": "https://assistant-assets.nickgriffin.uk/uploads/82a2eee9-001b-4e70-9bfa-7c5179b4c03b.png"
        }
      ]
    }
  ]
}'
```

Pixtral responded with this:

```markdown
This image presents the results of the UK General Election 2024, showing the winning parties in each constituency after all 650 seats have been declared. The results are displayed in two different formats: a hex map (equal area) and a geographical map.

### Key Points:

1. **Party Representation:**
- **Labour (Red):** 411 seats
- **Conservative (Blue):** 121 seats
- **Lib Dem (Yellow):** 72 seats
- **SNP (Orange):** 9 seats
- **Sinn Féin (Dark Green):** 7 seats
- **Independent (Gray):** 6 seats
- **DUP (Light Brown):** 5 seats
- **Reform (Light Blue):** 5 seats
- **Green (Light Green):** 4 seats
- **Plaid Cymru (Green):** 4 seats
- **SDLP (Dark Brown):** 2 seats
- **Alliance (Light Gray):** 1 seat
- **Speaker (Black):** 1 seat
- **TUV (Dark Blue):** 1 seat
- **UUP (Light Blue):** 1 seat

2. **Hex Map (Equal Area):**
- This map uses hexagons of equal size to represent each constituency, providing a visual representation where each constituency has the same visual weight regardless of geographical size.
- The Labour Party (red) dominates the map, particularly in England.
- The Conservative Party (blue) has a significant presence, especially in the southern and central regions of England.
- The Lib Dems (yellow) are scattered throughout England, with notable clusters.
- The SNP (orange) is predominantly in Scotland.
- Other parties have smaller, more localized presences.

3. **Geographical Map:**
- This map shows the actual geographical boundaries of each constituency.
- The distribution of colors is similar to the hex map but provides a more accurate geographical context.
- Scotland is predominantly SNP (orange) and Lib Dem (yellow).
- Northern Ireland shows a mix of parties, including Sinn Féin (dark green), DUP (light brown), and others.
- Wales has a mix of Labour (red), Conservative (blue), and Plaid Cymru (green).
  
### Analysis:
- **Labour's Dominance:** Labour has a strong presence across the UK, particularly in England, indicating a significant victory in this election.
- **Conservative Strongholds:** The Conservatives maintain a notable presence, especially in the southern and central regions of England.
- **Lib Dem Gains:** The Lib Dems have made significant gains, particularly in Scotland and parts of England.
- **SNP in Scotland:** The SNP remains the dominant party in Scotland, though with some competition from the Lib Dems.
- **Northern Ireland:** The political landscape in Northern Ireland is diverse, with multiple parties sharing the seats.

This visualization effectively highlights the political landscape of the UK following the 2024 General Election, showing the distribution of power among various political parties.
```

Pretty decent I think, it seems to have done a decent job of understanding the chart, however, it hasn't given expansive detail, that said, I didn't really ask for that.

### Documents

Mistral also say that's it's pretty good at documents so I thought I'd give it this quite intrecate page from a BBC whitepaper on "Using Behavioural Data to Assess the Environmental Impact of Electricity Consumption of Alternate Television Service Distribution Platforms" (you can [find the full paper here](https://downloads.bbc.co.uk/rd/pubs/whp/whp-pdf-files/WHP372.pdf)).

![A detailed description of the processes involved in television distribution and viewing, divided into three main stages: preparation, distribution, and consumption.](https://assistant-assets.nickgriffin.uk/uploads/WHP372.png)
([Image source](https://downloads.bbc.co.uk/rd/pubs/whp/whp-pdf-files/WHP372.pdf))

This time, I used this prompt:

```json
{
  "model": "pixtral-large-latest",
  "messages": [
    {
      "role": "user",
      "content": [
        {
          "type": "text",
          "text": "Analyse this page from the BBC whitepaper titltled: Using Behavioural Data to Assess the Environmental Impact of Electricity Consumption of Alternate Television Service Distribution Platforms"
        },
        {
          "type": "image_url",
          "image_url": "https://assistant-assets.nickgriffin.uk/uploads/WHP372.png"
        }
      ]
    }
  ]
}
```

Here was the output:

```markdown
The page you provided is from a BBC whitepaper titled \"Using Behavioural Data to Assess the Environmental Impact of Electricity Consumption of Alternate Television Service Distribution Platforms.\" This specific section, labeled \"2.2 Process Description,\" outlines the process model for television content distribution and consumption, breaking it down into three main stages: preparation, distribution, and consumption.

### Key Points:

#### 2.2 Process Description
- The process model describes how viewers receive and watch television content.
- Figure 1 (provided on the page) illustrates the process model, which includes three stages: preparation, distribution, and consumption.

#### 2.2.1 Preparation
- **Content Sequencing**: Live or pre-recorded content is sequenced using digital equipment for playout.
- **Encoding and Multiplexing**: 
  - Encoding: Reduces the bit rate of the content using audio and video compression techniques.
  - Multiplexing: Bundles multiple encoded streams of video, audio, and data together before distribution.
- **Distribution**: The final multiplexes are sent to the appropriate broadcast distribution infrastructure.
- **Storage**: A high-quality feed is sent to digital storage for Internet distribution. In the BBC's case, this storage is cloud-based and hosted by Amazon Web Services (AWS).

#### 2.2.2 Broadcast Distribution
- Distribution of content for broadcast occurs in three main ways:
  1. **Digital Terrestrial Television (DTT) Distribution**:
     - Involves relaying the signal to a network of transmission stations across the service area.
     - The BBC has over a thousand transmission stations across the UK.
     - Relaying is handled by a dedicated high-performance distribution network.

### Figure 1: Processes Involved in Television Distribution and Viewing
- The figure visually represents the flow from content preparation to distribution and finally to consumption.
- It includes various components such as:
  - Content Preparation (Live or Recorded)
  - Shared Broadcast Services
  - National Distribution Networks
  - Regional Distribution Networks
  - Various types of distribution (e.g., DTT, Cable, Satellite, Internet)
  - Household consumption devices (e.g., TVs, Set-Top Boxes, Computers)

### Additional Notes:
- The figure uses different shadings and line styles to indicate various types of distribution and data flow.
- The key on the right side explains the symbols used in the figure, such as different types of distribution networks and data flows.

This detailed breakdown helps in understanding the complex process of television content distribution and the various stages and technologies involved.
```

### Images

Last up is an image, this is the general use case, which I expect it to be pretty decent with.

This time I'm using the following image:

![A serene landscape during what appears to be late afternoon or early evening, with the sun low in the sky.](https://assistant-assets.nickgriffin.uk/uploads/54164645203_554bc9c357_c.jpg)
([Image source](https://www.flickr.com/photos/82887550@N00/54164645203/))

The prompt:

```json
{
  "model": "pixtral-large-latest",
  "messages": [
    {
      "role": "user",
      "content": [
        {
          "type": "text",
          "text": "Generate alt text for this."
        },
        {
          "type": "image_url",
          "image_url": "https://assistant-assets.nickgriffin.uk/uploads/54164645203_554bc9c357_c.jpg"
        }
      ]
    }
  ]
}
```

And the response:

> The image depicts a serene landscape during what appears to be late afternoon or early evening, with the sun low in the sky. The scene includes a road running parallel to a body of water, likely a river or a flooded area. The road is bordered by a concrete barrier on one side and a grassy embankment on the other. A car is visible on the road, heading away from the camera.
>
>The water reflects the sky and surrounding trees, which are mostly bare, suggesting it might be late autumn or winter. There are several ducks swimming in the water, and a large tree with bare branches stands prominently in the water. The sky is partly cloudy with patches of blue, and the clouds are illuminated by the setting sun, creating a warm and tranquil atmosphere. The overall scene is calm and picturesque.