---
title: "Project NG 2020: Building an Express Image Resizing API"
description: "Optimizing my site with automatic image resizing"
date: "Thursday, June 18 2020 3:48 pm"
archived: true
---

**Update: I have changed this slightly, it's similar code but now it's a serverless Lambda service! Check out the source code here: [https://github.com/nicholasgriffintn/images.nicholasgriffin.dev](https://github.com/nicholasgriffintn/images.nicholasgriffin.dev)**

Whenever you run a performance test against any application, you'll probably find issues with your images not being the right size.

One of the options for fixing this performance issue is to upload and load individual sizes for each of the image blocks on your application, however, I'm too lazy for that so we're building an Express API to make my life easier.

To start, we're going to do this in a really simple way that loads the images directly from the server.

It all starts with a component called resize.js:

This component requires two packages, fs and sharp.

fs for loading the files and sharp for the actual resizing.

```javascript
const fs = require("fs");
const sharp = require("sharp");

module.exports = function resize(path, format, width, height) {
  try {
    if (fs.existsSync(path)) {
      const readStream = fs.createReadStream(path);
      let transform = sharp();

      if (format) {
        transform = transform.toFormat(format);
      }

      if (width || height) {
        transform = transform.resize(width, height);
      }

      return readStream.pipe(transform);
    }
  } catch (err) {
    console.error(err);
  }
};
```

On the Express API side of things, we need to import this component into our API file like so:

```javascript
const resize = require("./resize");
```

Then we can create our API route like so:

```javascript
server.get("/api/images/resize", (req, res) => {
  // Extract the query-parameter
  const widthString = req.query.width;
  const heightString = req.query.height;
  const format = req.query.format || "png";
  const image = req.query.image
    ? "public/images/" + req.query.image
    : "public/icon.png";

  // Parse to integer if possible
  let width, height;
  if (widthString) {
    width = parseInt(widthString);
  }
  if (heightString) {
    height = parseInt(heightString);
  }
  // Set the content-type of the response
  res.type(`image/${format || "png"}`);

  // Get the resized image
  resize(image, format, width, height).pipe(res);
});
```

This just grabs the parameters from the URL query and then passes it to our resize function, from which the file will be grabbed by fs and then sharp will be run in order to format the image and resize it.

You'll notice that the image variable is adding the folder location to the image query parameter.

When live we can request an image like this:

`https://nicholasgriffin.dev/api/images/resize?image=posts/project-ng-2020-securing-my-website-with-aws-cognito/thumbnail.png&width=400&height=200`

Here's an example of one with width 400 and height 200:



And here's another that's been set to 80x80:



Yes, it really is that simple and this could save you a ton of money that you would otherwise have to spend on a service like Imgix, granted without the crop and editing features for now, we'll get there.

Of course, it's not good enough grabbing images from the server for something like this, we need our images to be served as fast as possible and we want to reduce the amount that we require server storage.

So obviously we need to change this to use AWS S3.

For that, our resize.js component needs to be changed to the following:

```javascript
const fs = require("fs");
const sharp = require("sharp");

const AWS = require("aws-sdk");
AWS.config.loadFromPath("./aws-config.json");
const S3 = new AWS.S3({
  signatureVersion: "v4",
});

module.exports = function resize(path, format, width, height) {
  try {
    let quality = 80;

    return S3.getObject({
      Bucket: "cdn.nicholasgriffin.dev",
      Key: path,
    })
      .promise()
      .then((data) => {
        if (data && data.Body) {
          return sharp(data.Body)
            .resize(width, height)
            .toFormat(format, { quality: quality })
            .toBuffer();
        } else {
          return {
            statusCode: 500,
            body: "No image data was returned.",
          };
        }
      })
      .catch((err) => {
        console.error(err);
        if (err.code === "NoSuchKey") err.message = "Image not found.";
        return {
          statusCode: err.statusCode,
          body: err.message,
        };
      });
  } catch (err) {
    console.error(err);
  }
};
```

As you can see this is very different, basically, what this does is grab the buffer data from s3 and then run that through sharp.

Because the output is different, we also need to change how the API responds, and so this our new API code:

```javascript
server.get("/api/images/resize", imageLimiter, async (req, res) => {
  const widthString = req.query.width;
  const heightString = req.query.height;
  const format = req.query.format || "png";
  const image = req.query.image ? req.query.image : "icon.png";

  // Parse to integer if possible
  let width, height;
  if (widthString) {
    width = parseInt(widthString);
  }
  if (heightString) {
    height = parseInt(heightString);
  }

  // Get the resized image
  const imageResized = await resizeImage(image, format, width, height);

  console.log(imageResized);

  if (imageResized && !imageResized.statusCode) {
    // Set the content-type of the response
    res.type(`image/${format || "png"}`);

    const imageResizedBase = Buffer.from(imageResized, "base64");

    res.end(imageResizedBase);
  } else {
    // Set the content-type of the response
    res.type("application/json");

    res.send(imageResized);
  }
});
```

This will now check for the existance of a status code to check if an image has been return, if it hasn't, we change the type and send the json response instead.

Awesome right? Next up on my website for 2020 will be combining all of this and expanding our code for a full blog post and admin system, dashboard and all.

![Hell Yeah!](https://media.giphy.com/media/dkGhBWE3SyzXW/giphy.gif)