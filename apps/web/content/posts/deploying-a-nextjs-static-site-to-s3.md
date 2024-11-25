---
title: "Deploying a NextJS static site to S3"
description: "After using NextJS for a static site and deploying it to S3 I noticed a few issues, this post talks about my experience with that."
date: "2020-08-16T15:48"
archived: true
tags: [nextjs, s3, static-site]
---

So quite some time now, I've been figuring out which is better, Gatsby JS or NextJS.

In reality, the answer is really that they are both fantastic solutions for different purposes, Gatsby can be better in some circumstances, however, NextJS is definitely more expansive of a solution and can be used for a range of different purposes.

Recently, NextJS was expanded with some more capabilities that made it a pretty decent solution for static sites as well, thanks to a couple of APIs, [getStaticPaths and getStaticProps](https://nextjs.org/docs/basic-features/data-fetching).

Both of these combined the the next export command allows you to build pretty fantastic static websites, however, if you use them, you may find a similar issue to what I have.

The problem that I found was that although both of these APIs work great, on export, Next will output the files with uri encoded names, and not within a set of folders.

While this may not seem like much of an issue, when it comes to S3 static websites, it's much better to have a directory-based structure.

So for my use case, I needed a script that will create folders for each of the URL params in order and then store the actual html file, within the created folder as index.html.

This will allow us to easily integrate with S3 Static Websites as S3 will load the index.html file according to the URL path by default, without this, and with the default NextJS exported files, your URLs will need to end with .html and have the encoded values within them, which isn't great.

Anyway, long story short here's the script that I created:

https://gist.github.com/nicholasgriffintn/d08f6dd048738db028e12321d1974e38