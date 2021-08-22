const sharp = require('sharp');

const AWS = require('aws-sdk');
const S3 = new AWS.S3({
  accessKeyId: process.env.CDN_ACCESS_KEY_ID || '',
  secretAccessKey: process.env.CDN_SECRET_ACCESS_KEY || '',
  region: 'eu-west-1',
  signatureVersion: 'v4',
});

const resize = (path, format, width, height, fit, position, quality) => {
  try {
    console.log(
      'Resizing Image: ',
      path,
      format,
      width,
      height,
      fit,
      position,
      quality
    );

    return S3.getObject({
      Bucket: 'cdn.nicholasgriffin.dev',
      Key: path,
    })
      .promise()
      .then((data) => {
        if (data && data.Body) {
          return sharp(data.Body)
            .resize(width, height, {
              fit: fit ? fit : 'cover',
              position: position ? position : 'centre',
            })
            .toFormat(format, { quality: quality })
            .toBuffer();
        } else {
          return {
            statusCode: 500,
            body: 'No image data was returned.',
          };
        }
      })
      .catch((err) => {
        console.error(err);
        if (err.code === 'NoSuchKey') err.message = 'Image not found.';
        return {
          statusCode: err.statusCode,
          body: err.message,
        };
      });
  } catch (err) {
    console.error(err);
  }
};

export default (req, res) => {
  try {
    async function triggerResize() {
      // Extract the query-parameter
      if (!req.query.image) {
        res.status(400);

        res.send({ status: 'error', message: 'No image was provided.' });
      }

      const widthString = req.query.width || req.query.w;
      const heightString = req.query.height || req.query.h;
      const format = req.query.format || req.query.fm || 'png';
      const image = req.query.image ? req.query.image : 'icon.png';
      const fit = req.query.fit || 'cover';
      const position = req.query.position || 'centre';
      const quality = req.query.quality
        ? Number(req.query.quality)
        : req.query.q
        ? Number(req.query.q)
        : 80;

      // Parse to integer if possible
      let width, height;
      if (widthString) {
        width = parseInt(widthString);
      }
      if (heightString) {
        height = parseInt(heightString);
      }

      // Get the resized image
      const imageResized = await resize(
        image,
        format,
        width,
        height,
        fit,
        position,
        quality
      );

      if (imageResized && !imageResized.statusCode) {
        res.status(200);

        // Set the content-type of the response
        res.setHeader('Content-Type', `image/${format || 'png'}`);

        var imageResizedBase = Buffer.from(imageResized, 'base64');

        res.end(imageResizedBase);
      } else {
        res.status(500);

        res.send(imageResizedBase);
      }
    }

    triggerResize();
  } catch (err) {
    res.status(500);

    console.error(err);

    res.send(imageResizedBase);
  }
};
