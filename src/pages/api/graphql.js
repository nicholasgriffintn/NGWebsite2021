const GraphQL = (req, res) => {
  res.status(500).json({
    status: 'Error',
    message:
      "Sorry, I've moved the site to AWS Amplify and so the GraphQL service is no longer hosted within the site.",
  });
};

export default GraphQL;
