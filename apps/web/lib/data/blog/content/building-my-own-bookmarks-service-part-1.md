---
title: "Building my own bookmarks service: Part 1"
description: "A new Serverless Lambda that will parse bookmarks data into DynamoDB"
date: "Monday, August 30 2021 12:53pm"
updated: "Monday, August 30 2021 2:04pm"
archived: true
---

Earlier this week I created my own personal email service as the initial step towards building my own bookmarks service for my personal site.

This service receives an email and then categorises it into a selection of folders, from which I plan to build additional services to parse data from these folders and then action on that data according to the category, today we are building the first of those additional services, my bookmarks service.

You can find out more about the categorisation Lambda here: https://nicholasgriffin.dev/blog/cf3c4661-f676-4028-879b-f2686852b82b

## Starting off our Serverless service

To kick things off, we need to initialise our new Serverless service that will become a Lambda and API Gateway once we deploy it.

For me, this starts with the basic Serverless configuration, which is:

```yaml
service: serverless-bookmarks-service

provider:
  name: aws
  runtime: nodejs12.x
  stage: prod
  region: eu-west-1
  stackName: serverless-bookmarks-service-stack
  apiName: serverless-bookmarks-service-api
  iamRoleStatements:
    - Effect: 'Allow'
      Action:
        - 's3:*'
      Resource: 'arn:aws:s3:::email.nicholasgriffin.dev/*'
```

I have also set up a function for processing the emails that have been stored in order processed bookmarks folder like so:

```yaml
functions:
  process:
    handler: handler.process
    description: Process Bookmark emails to DynamoDB
    timeout: 15
    events:
      - s3:
          bucket: email.nicholasgriffin.dev
          event: s3:ObjectCreated:*
          rules:
            - prefix: processed/bookmarks/
            - suffix: .json
          existing: true
```

I’ll add some API functions here later as well, but for now, this is the first step.

Creating a function to process our stored Bookmark emails
For our process function, we need to start by creating a couple of variables for the event data that AWS sends when the function is triggered via the rules we set above.

These are:

```javascript
const bucket = event.Records[0].s3.bucket;
const object = event.Records[0].s3.object;
```

The bucket variable will contain data about the bucket that the file is stored in, including the name, ownerIdentity and the arn for the bucket.

The object variable contains all the data for the file itself, including the key, size, eTag, and sequencer.

Take not that this will not provide the actual file data, so we need to grab that separately, which we will do like so:

```javascript
      const bookmarkBucket = event.Records[0].s3.bucket.name;
      const bookmarkKey = decodeURIComponent(event.Records[0].s3.object.key.replace(/\+/g, ' '));

      console.info(
        `Fetching email at s3://${bookmarkBucket}/${bookmarkKey}`
      );

      const data = await s3
        .getObject({
          Bucket: bookmarkBucket,
          Key: bookmarkKey,
        })
        .promise();
```

The data object should now contain all of the data for the bookmark email that we previously stored.

From here, we’ll need to process the contents into a DynamoDB table.

We are pushing it to a DynamoDB table so that we can ensure that all data that end up accessible to the API has been processed correctly and validated.

## Setting up my Bookmarks DynamoDB table

To get started with storing on DynamoDB, I’ll need to create a table first. This is very simple, just head on over to the DynamoDB section within AWS here:

https://eu-west-1.console.aws.amazon.com/dynamodbv2/home?region=eu-west-1#dashboard

And click the Tables option on the left-hand side. From this page hit the “Create table” button to create a new table!

I’m naming mine “Bookmarks-Service” and setting the partition key as “id” with the type string, as each of our Bookmarks will have its own unique ID.

For the sort key, I will add a new string value named ‘status’, this will be for sorting the bookmarks by verified and unverified statuses.

Leave everything as default and click the “Create table button” at the bottom as these are all sensible settings, no further configuration is required unless you really want to.

Once the creation has finished, grab a note of your ARN for the DB as you’ll need that later.

## Parsing my bookmarks email

So now it’s time for the fun part, parsing my bookmarks email.

In my inbox service, I am storing the data as JSON and it comes out to be similar to this (with the headers and attachments removed to make it smaller):

```json
{
    "id": "1o7micppvf093nffskmek05ts00kcml2d92tbqo1",
    "received": "2021-08-29T18:37:27.000Z",
    "to": {
        "value": [
            {
                "address": "bookmarks@nicholasgriffin.dev",
                "name": ""
            }
        ],
        "html": "<span class=\"mp_address_group\"><a href=\"mailto:bookmarks@nicholasgriffin.dev\" class=\"mp_address_email\">bookmarks@nicholasgriffin.dev</a></span>",
        "text": "bookmarks@nicholasgriffin.dev"
    },
    "from": {
        "value": [
            {
                "address": "me@nicholasgriffin.co.uk",
                "name": "Nicholas Griffin"
            }
        ],
        "html": "<span class=\"mp_address_group\"><span class=\"mp_address_name\">Nicholas Griffin</span> &lt;<a href=\"mailto:me@nicholasgriffin.co.uk\" class=\"mp_address_email\">me@nicholasgriffin.co.uk</a>&gt;</span>",
        "text": "Nicholas Griffin <me@nicholasgriffin.co.uk>"
    },
    "subject": "Test with new roles",
    "headers": [
    ],
    "attachments": [
    ],
    "html": "<html><head></head><body><div><br></div><div><br></div><div id=\"protonmail_signature_block\" class=\"protonmail_signature_block\"><div><div>Thanks,<br></div><div><br></div><div>Nicholas Griffin</div></div></div> </body></html>\n\n\n"
}
```

For id, received and subject, we can already consider that processed and good to go.

For the to and from, we’ll just want to trim that down so that we just have the name and address, which is done quite easily: from.value[0].address and from.value[0].name.

The tricky part will be the HTML, as here what I’ll need to do is go through the contents of the email in order to find the attribute that I need for my bookmark.

I’m going to do this by using indexOf and substring, probably not the best way to do it, but it works and I don’t want to commit too much time to this just yet, so that’s what I’m using :), feel free to pop a pull request in if you can think of something better xD.

Anyway, so with that, we end up with the following code to process our data into an object that we can send to DynamoDB:

```javascript
const { id, received, subject, from, to, html } = json;

          const fromAddress = from.value[0].address;
          const fromName = from.value[0].name;

          const toAddress = to.value[0].address;
          const toName = to.value[0].name;

          // TODO: parse the html for bookmark data
          const bookmark = {};

          function extractData(data, startStr, endStr) {
            subStrStart = data.indexOf(startStr) + startStr.length;
            return data.substring(
              subStrStart,
              subStrStart + data.substring(subStrStart).indexOf(endStr)
            );
          }

          bookmark.title = extractData(html, '<div>Title: ', '</div>');
          bookmark.description = extractData(
            html,
            '<div>Description: ',
            '</div>'
          );
          bookmark.url = extractData(html, '<div>URL:&nbsp;', '</div>');
```

We then create another object in the format thatwill dynamoDB will accept this data and then we store it:

```javascript
const dataOutput = {
              Item: {
                id: {
                  S: id,
                },
                status: {
                  S: 'unverified',
                },
                recieved: {
                  S: recieved,
                },
                bookmark: {
                  S: JSON.stringify(bookmark),
                },
                subject: {
                  S: subject,
                },
                fromAddress: {
                  S: fromAddress,
                },
                fromName: {
                  S: fromName,
                },
                toAddress: {
                  S: toAddress,
                },
                toName: {
                  S: toName,
                },
              },
            };

            var params = {
              Item: dataOutput.Item,
              TableName: config.tableName,
            };

            const result = await dynamodb.putItem(params).promise();
```

And now that has been done, we can delete the original object and return the result:

```javascript
              await s3
                .deleteObject({
                  Bucket: bookmarkBucket,
                  Key: bookmarkKey,
                })
                .promise();

              return {
                statusCode: 200,
                body: JSON.stringify({
                  message: result,
                  event,
                }),
              };
```

And that’s it, now we have a service that will process our bookmarks emails and then store that processed data in DynamoDB.

Next up, we need to create our GraphQL service that will allow us to interact with this stored data, but before then it’s time to have quick break.

While you are on your break you can check out the code here (spoilers: this may include the API by the time you look at it): https://github.com/nicholasgriffintn/Bookmarks-Service

**Update: [You can check out part 2 here](/blog/building-my-own-bookmarks-service-part-2)**