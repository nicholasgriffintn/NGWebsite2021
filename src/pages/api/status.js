// import { withSentry } from '@sentry/nextjs';
const pkg = require('../../../package.json');

const StatusCheck = (req, res) => {
  return new Promise((resolve) => {
    res.statusCode = 200;
    res.json({
      status: 'Everything seems fine!',
      version: pkg.version,
    });

    return resolve();
  });
};

// export default withSentry(StatusCheck);
export default StatusCheck;
