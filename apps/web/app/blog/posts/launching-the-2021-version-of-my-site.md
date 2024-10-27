---
title: "Launching the 2021 version of my site"
description: "It's that time again!"
date: "2021-08-21T21:33"
updated: "2021-08-21T21:56"
archived: true
---

If you have followed my site for some time then you would know that I've been creating a new version of my site pretty much every year, we've gone all the way from a simple WordPress server up to what I have live today, a NextJS server with all of the modern tools and services linked.

## So what's happening in 2021?

This year, I have decided to build on what I created back in 2020 for my personal website https://github.com/nicholasgriffintn/NGWebsite2020 but this time, I've cut the servers and instead I've gone all out with serverless technology and AWS Amplify.

AWS Amplify is a pretty awesome tool from AWS that makes starting out super simple, it includes a number of commands that allow for the generation of APIs, storage and more super easy.

Alongside that, you can also use it to add on extra stuff like authentication and what AWS calls DataStore.

## The new stuff

You can find all of the new code for my personal site here: https://github.com/nicholasgriffintn/NGWebsite2021

This new site is using NextJS like before, but I have replaced Postgres and a Linux server with AWS' DynamoDB, Lambda service, API Gateway and AppSync, which is all managed, created and updated using the tools from AWS Amplify as explained before, with full CI/CD when linked to the Github repo.

Alongside that, I've added authentication to the site.

By default, the site runs in an unauthenticated mode, but there is also the option of adding a login for any tools that I might add in the future such as a page to create posts or even the ability to create comments (there's a preview of that coming below at some point soon).

Of course, that's not all, I've also used this as a great time to update all of the site's code and clean up some of the stuff that got left behind last year.

Sadly, with the change, I have had to remove a few bits, bit I'm going to be working on adding more of these soon.
