const pkg = require('../../../package.json');

const StatusCheck = (req, res) => {
  res.statusCode = 200;
  res.json({
    status: 'Everything seems fine!',
    version: pkg.version,
  });
};

export default StatusCheck;
