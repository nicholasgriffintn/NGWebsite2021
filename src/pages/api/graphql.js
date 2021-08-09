// Next.js API route support: https://nextjs.org/docs/api-routes/introduction

const pkg = require('../../../package.json');

export default (req, res) => {
  res
    .status(500)
    .json({
      status: 'Error',
      message:
        "Sorry, I've moved the site to AWS Amplify and so the GraphQL service is no longer hosted within the site.",
    });
};
