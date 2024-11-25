---
title: "Amazon S3 Express One Zone now supports the ability to append data to an object"
date: "2024-11-25T02:51"
tags: [aws, s3]
link: "https://docs.aws.amazon.com/AmazonS3/latest/userguide/directory-buckets-objects-append.html"
---

Over the last week I saw a few people talking and a new addition to Amazon S3 that sounds super cool, the ability to append data to an existing object in a bucket, previously, you would have to replace the object with an updated version completed, this brings new use cases to S3 such as adding new logs, storing video segments as they are processed and I'm sure many more.

It should be noted that this is only available with the [Express Zone class](https://aws.amazon.com/blogs/aws/new-amazon-s3-express-one-zone-high-performance-storage-class/), which is a recent storage class that AWS added for higher performance than the standard S3 storage class.

This does mean that it has reduced redundancy and a much higher price point per GB ($0.16 per GB vs from $0.023 per GB for standard), however, that probably isn't too prohibitive for the use cases that this feature is aimed at, you can also create some automation to move the data to a cheaper storage class after it's been processed.