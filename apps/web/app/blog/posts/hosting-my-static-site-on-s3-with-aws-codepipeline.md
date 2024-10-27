---
title: "Hosting my static site on S3 with AWS CodePipeline"
description: "How I'm using AWS CodePipeline to automatically build and push my site to AWS' S3"
date: "Friday, May 31 2019 3:48 pm"
archived: true
---

So alongside my adventures with Nuxt and static sites yesterday, I thought it would be a good time to start using CI/CD for my personal website with the help of AWS CodePipeline. I have been using this a lot at work for a few projects and I have to say, it is a fantastic tool for quickly and automatically building and deploying a website to a range of Amazon's services, including ECS, EC2, S3 and many more.

As we are building a static site, we will be deploying straight to an S3 bucket that will have static website hosting enabled. The pipeline will be triggered by a commit to a branch within my personal website's repo onn Github, you can also use CodeCommit if you prefer to keep it within AWS, personally, I prefer Github as it works with more services.

## Setting up our repo

I'm going to assume that you already have your static website committed to a master branch of a repo somewhere.

That's completely fine, however, if you are going to be using a static site generator like Nuxt or Gatsby then you are going to want to split your build files from the build tool, as you don't want the build tool going up to your S3 bucket or your website.

You could just create two repos for this and that would work, however, I prefer to create two main branches within a single repo that I can then target depending on what I want to do.

For this, I left the master branch as my branch for my website's build and then created a second branch for the deployments, called master-deploy.

![]()

You will find that Github might tell you one branch is outdated with this method, as you will have to commit seperately every time you push new content, however, in my opinion, it makes the whole process cleaner and you can probably ignore most of that annyway as once this is set up, you probably won't have to go to the UI all that often.

Once that's done you should commit your first build to the deploy branch ready for the next steps.

## Creating our S3 bucket

Before we can create our pipeline, you'll need to create and setup a new S3 bucket to host your website on.

I'll let Amazon explain the initial processes of this, as it's quite simple and is likely to change a lot. You just need to make sure that you name your bucket with the same domain name that you'll be using for the HTTP access. So for me, that would be 'nicholasgriffin.dev'.

Once created, you'll want to attach a policy to your bucket to ensure that all files are public.

As the whole idea of this is that deploys will happen automatically, we don't want to be setting permissions manually.

You can do this by clicking on the permissions tab within you S3 bucket and then on Bucket policy. There you'll need to add the following to the policy editor.

```json
{
    "Version": "2008-10-17",
    "Statement": [
        {
            "Sid": "AllowPublicRead",
            "Effect": "Allow",
            "Principal": {
                "AWS": "*"
            },
            "Action": "s3:GetObject",
            "Resource": "arn:aws:s3:::nicholasgriffin.dev/*"
        }
    ]
}
```

You'll need to change the ARN to your S3's path, however, once you've copied that in, all your files should allow public reading by default.

Next you'll need to click on the 'Static website hosting' tab and enabled static hosting.

Enter index.html for the index page and 200.html for the error page, or whatever your error page url and index page is. Nuxt has it's own error handling so the error page doesn't matter too much.

## Setting up CodePipeline

Once you have done both of those steps you'll be ready to set up your pipeline for deployments.

To do this, head over to CodePipeline in AWS and select 'New Pipeline', give your pipeline a fitting name and then select 'Next'.

![]()

Next you'll need to add a source provider.

We are using Github, once you select that you have to connect you account and then select both the repo that you want to use and the branch, like what I've selected in the above image.

You should also use the recommended detection option of Github webhooks.

Once that's done you can move onto the next step, which should be the build stage, we're not using this stage so we'll skip this and move onto the next stage.

On the build stage, you will need to select the deploy provider and set up the settings.

![]()

For this, we will be using Amazon S3 as the provider.

Once selected you'll need to select the bucket region and name that you want to use, then ignore the S3 object key and just check 'Extract file before deploy', the key input will then change to a path, we don't need that, but you can use it if you like.

Once that's done all that's left is for you to review and deploy, it really is that simple.

## That really is it

You now have simple pipeline that will ensure that your deployments are quick and painless.

![Computers](https://media.giphy.com/media/D83jHtnO0LPQk/giphy.gif)

