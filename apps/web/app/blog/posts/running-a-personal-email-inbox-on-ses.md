---
title: "Running a personal email inbox on SES"
description: "I'm creating an AWS Lambda service that will receive and process emails"
<<<<<<< Updated upstream
date: "Sunday, August 29 2021 8:03 pm"
update: "Sunday, August 29 2021 8:04 pm"
=======
date: "2021-08-29T20:03"
update: "2021-08-29T20:04"
>>>>>>> Stashed changes
archived: true
---

This week during the long weekend, I figured that I’d start a new project for a new service that I thought I’d build, a new Lambda that will receive emails from AWS SES and then store a bookmark link from that email in a DynamoDB table, from which I should be able to create a new API and page that will list anything I find interesting on my site.

Obviously there will be a few steps for this in order to get started and we are going to have to work out stuff for security, but it should be a lot of fun.

Let’s get started with creating our own personal email inbox on SES, which is the first step required in the chain of this personal project.

## Creating your AWS SES domain

First up, you’ll need to create a new domain on AWS SES if you don’t already have this, which you can do from the SES homepage.

https://eu-west-1.console.aws.amazon.com/ses/home

I did this for my website domain, which previously didn’t have an SES service setup for it.

This is super simple if your domain is on Route 53 as AWS will update your records automatically, if it isn’t then you’ll need to update your DNS records accordingly.

You’ll want to make sure that you also generate a record for incoming emails or this won’t work.



If you want to be able to send emails from SES, you’ll also want to move your account out of “sandbox” mode, which can be done from the “Sending Statistics” page.

## Creating a rule set

From the same SES page on AWS, under the Email Receiving section you should see a link for rule sets. Click on this link to navigate to the page for creating a rule set.

From here, you just need to follow the prompts to get started with a rule set.

First enter the domain that you want to receive emails from (must be one that has been verified), and then select the bucket that you want to store the emails you receive in and enter a prefix if you’d like to store the emails in a folder, which I’d advice.

Make a note of all these settings as they’ll be needed for the lambda.

## Creating an inbox Lambda

Because rule sets don’t really allow you to specify specific buckets for categories of processing we are going to have to do this on our lambda individually.

My plan is to do this on a specific lambda that will process the received message, categorise it and then create a JSON object of the parsed email in a new folder within our email bucket.

We can then have additional lambdas for each of the additional tasks that we want to perform.

You can find my categorisation Lambda here: https://github.com/nicholasgriffintn/Serverless-Email-Inbox

This function takes an event from SES (which will be sent to it later) and then processes that event to store the email in the right place, this is done with the following two variables:

```javascript
const mail = event.Records[0].ses.mail;
const receipt = event.Records[0].ses.receipt;
```

The mail object contains all of the email information and receipt is just some metadata that SES sends for us based on their processing.

The main reason we grab the receipt is for the spam detection information, which we need to check to make sure the email hasn’t failed before we go any further, this is done like so:

```javascript
      const verdicts = [
        'spamVerdict',
        'virusVerdict',
        'spfVerdict',
        'dkimVerdict',
        'dmarcVerdict',
      ];

      for (let key of verdicts) {
        const verdict = receipt[key];

        if (verdict && verdict.status === 'FAIL') {
          throw new Error(
            `rejected by spam filter; ${key} = ${verdict.status}`
          );
        }
      }
```

If any of those fail an error will be thrown and the rest won’t proceed, if it passes, we move onto the next step, which is to parse the email.

To do this, we grab the messageId from the mail object and then fetch the stored email from our S3 bucket, like so:

```javascript
      const { messageId } = mail;

      console.info(
        `Fetching email at s3://${config.bucket}/${config.keyPrefix}${messageId}`
      );

      const data = await s3
        .getObject({
          Bucket: config.bucket,
          Key: `${config.keyPrefix}${messageId}`,
        })
        .promise();
```

We then send the output to a handy function called simpleParser from the mail parser package with Inconv character encoding conversion:

```javascript
const parsed = await simpleParser(data.Body, { Iconv });
```

You can find out more about mail parser here: https://www.npmjs.com/package/mailparser and Iconv here (I’m using the lite version): https://www.npmjs.com/package/iconv-lite

With mailparser, we get a JSON output of the email with some handy stuff like the from, to, attachments, subject, html and more.

For this package, I’m creating a new object called processed, which I will then store within our category folder like so:

```javascript
        const processed = {};

        processed.id = messageId;
        processed.recieved = date;
        processed.to = to;
        processed.from = from;
        processed.subject = subject;
        processed.headers = headerLines;
        processed.attachments = attachments;
        processed.html = html;
        processed.subject = subject;

        const categoryFound = config.emailToCategories.find(
          (category) => category.email === to.value[0].address
        );

        let processedBucket = config.defaultCategory.bucket;
        let processedKeyPrefix = `${config.defaultCategory.keyPrefix}/${messageId}.json`;
        let response = `${config.defaultCategory.category} message processed into bucket: ${config.defaultCategory.bucket} with the key: ${config.defaultCategory.keyPrefix}${messageId}`;

        if (categoryFound) {
          processedBucket = categoryFound.bucket;
          processedKeyPrefix = `${categoryFound.keyPrefix}/${messageId}.json`;
          response = `${categoryFound.category} message processed into bucket: ${categoryFound.bucket} with the key: ${categoryFound.keyPrefix}${messageId}`;
        }
```

We store the new processed JSON in the correct folder depending on the category (which is determined by which email address the message was sent to) and then delete the original email file from the bucket:

```javascript
        const processedData = await s3
          .putObject({
            Bucket: processedBucket,
            Key: processedKeyPrefix,
            Body: JSON.stringify(processed),
            ContentType: 'application/json',
          })
          .promise();

        if (processedData) {
          console.info('Deleting the original email...');

          await s3
            .deleteObject({
              Bucket: config.bucket,
              Key: `${config.keyPrefix}${messageId}`,
            })
            .promise();

          console.info(response);

          return {
            statusCode: 200,
            body: JSON.stringify({
              message: response,
              event,
            }),
          };
        } else {
          throw new Error('File could not be processed.');
        }
```

And that’s it! Now we have a fully fledged email inbox processing service that will receive emails to our domain, categorise them and then store the contents in a folder of our S3 bucket.

Next up is to create a service that will look at our new bookmarks service and then correctly process that information for use with our upcoming bookmarks page.

Be sure to bookmark this page if you want to follow the process 😉.

For now, it’s time for a cuppa!
