const config = {
  aws_project_region: 'eu-west-1',
  aws_cognito_identity_pool_id:
    'eu-west-1:3f27a30a-8552-484f-b957-b6a60712348f',
  aws_cognito_region: 'eu-west-1',
  aws_user_pools_id: 'eu-west-1_tJYJZEedK',
  aws_user_pools_web_client_id: '4917v28ck10k4ode27sgtkhppn',
  oauth: {},
  aws_appsync_graphqlEndpoint:
    'https://lfzlhmob5bfcnidno6jphq4hky.appsync-api.eu-west-1.amazonaws.com/graphql',
  aws_appsync_region: 'eu-west-1',
  aws_appsync_authenticationType: 'AWS_IAM',
  aws_cloud_logic_custom: [
    {
      name: 'AdminQueries',
      endpoint: 'https://dztqha5gv0.execute-api.eu-west-1.amazonaws.com/dev',
      region: 'eu-west-1',
    },
  ],
};

export default config;
