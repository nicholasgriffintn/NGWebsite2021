---
title: "Using Sentiment Analysis to test user interaction"
description: "Using AWS Comprehend to perform Sentiment Analysis on comments."
date: "2019-05-20T15:31"
archived: true
tags: [aws, comprehend, serverless, lambda, api-gateway]
---

So recently I attended the AWS Summit in London. There was a ton of new stuff to see at the show but alongside the DeepRacer demos, there was a clear focus on machine learning. Amazon has a ton of new machine learning tech to play with and I obviously want to take them up on that.

To kick things off, I wanted to see what I could do with their comprehend and recognition APIs as this seemed the most useful for the sort of work I do, in particular with user interaction.

One thing that I thought that would work really I particular would be a comments section, so that's what I'm going to make today, a comments system that points out when a user might be writing something that might be offensive.

## How are we going to do that?

There are a few places that you could go to for APIs that can do sentiment analysis, however, as I do prefer AWS, we will be using AWS Comprehend.

I like this API not only because I like AWS but also because it integrates well with AWS and is really simple to set up.

Obviously, in order to get started, you are going to need an AWS account and a credit/debit card behind it. That said, AWS Comprehend is actually pretty cheap and you only pay for what you use, on the free tier you'll get 50K units of text or 5M characters for free to use for the APIs included within Comprehend, starting from your first request, aside from the custom Classification and Custom Entities APIs.

You can [view the rest of the pricing here](https://aws.amazon.com/comprehend/pricing/).

Alongside that, we will be setting up an API Gateway and a Lambda. To generate those I'll be using the [Serverless Framework](https://serverless.com/) because that's a lot more fun.

## Setting up our Serverless environment

Getting started with Serverless is really simple, just run the command `npm install serverless -g` in your terminal window.

Once that's done, you can create a base project with 'serverless create --template aws-python3 --name comments-comprehend' and then deploy it with 'serverless deploy' (after adding your AWS keys). You should find two files after generating your template, a handler.py file for your lambda code and a serverless.yaml file for your serverless config. 

Simply change the names and values in both for what you're creating.

You'll also want to add the following to your provider config so that the iAM user created can access Comprehend, I have left this a wildcard, you should segment it down for application security.

```yaml
iamRoleStatements: 
- Effect: Allow Action: 
- logs:CreateLogGroup 
- logs:CreateLogStream 
- logs:PutLogEvents 
- comprehend:DetectDominantLanguage 
- comprehend:DetectSentiment 
Resource: "*"
```

And that's the first part of the serverless framework stuff done.

## Configuring your Lambda function

Now you want to head over to your handler.py file and start editing.

First add in the required imports:

```python
    import os, boto3, json
```

Then we are going to add a bit of code to show a message depending on the sentiment, one for negative comments and one for positive.

```python
    NEGATIVE_COMMENT_MESSAGE="Your comment is too negative to post, please edit it."
    
    POSITIVE_COMMENT_MESSAGE="Your comment looks great. Keep up the good work!"
    
    client=boto3.client('comprehend')
    
    def sentimentAnalysis(event, context): 
        inputTranscriptData=event['queryStringParameters']['inputTranscript'] 
        
        print(inputTranscriptData); 
        
        sentiment=client.detect_sentiment(Text=inputTranscriptData,LanguageCode='en')['Sentiment'] 
        
        if sentiment=='NEGATIVE': 
            return{
                "statusCode": 200, 
                "body": json.dumps(NEGATIVE_COMMENT_MESSAGE)
            } 
        else: 
            return{
                "statusCode": 200, 
                "body": json.dumps(POSITIVE_COMMENT_MESSAGE)
            }
```

That's obviously pretty simplistic, however, that might be just about all we need, we can expand it later.

Now you are ready to deploy that by running 'Serverless Deploy'.

## Testing your function

Once pushed, you can test your function from within the  AWS Management Console with the following test or something  similar:

```python
    {
        "queryStringParameters":{
            "inputTranscript": "I love flowers"
        }
    }
```

Feel to change it to see what you get back.

## Setting up API Gateway

This should already be done for you by Serverless, you may want to  add some authentication,  if you don't you can carry on, simply query your API Gateway domain with a query string of the text that you want to validate against, like the following:

https://47477fgdhd.execute-api.eu-west-1.amazonaws.com/dev/sentiment-analysis?inputTranscript=I%20Love%20Flowers

It should return a 200 response alongside your text if you did everything right.

## Linking everything together

Now you just need to link the API Gateway to your front end. I built a simple front end form that show the validate message upon submit.

You can check that out alongside the rest of the code on my [Github](https://github.com/nicholasgriffintn/comments-comprehend). And if you are really interested, keep it bookmarked, I'll be updating it soon.