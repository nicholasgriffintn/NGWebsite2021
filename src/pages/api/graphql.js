// import { withSentry } from '@sentry/nextjs';

const GraphQL = (req, res) => {
  return new Promise((resolve) => {
    res.status(500).json({
      status: 'Error',
      message:
        "Sorry, I've moved the site to AWS Amplify and so the GraphQL service is no longer hosted within the site.",
    });

    return resolve();
  });
};

// export default withSentry(GraphQL);
export default GraphQL;
