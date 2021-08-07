// Next.js API route support: https://nextjs.org/docs/api-routes/introduction

const pkg = require('../../../package.json');

export default (req, res) => {
  res.statusCode = 200;
  res.json({
    status: 'Everything seems fine!',
    version: pkg.version,
  });
};
