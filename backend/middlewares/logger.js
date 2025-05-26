const morgan = require('morgan');

// Create a logger middleware
const logger = (req, res, next) => {
  console.log(
    `${req.method} ${req.protocol}://${req.get('host')}${req.originalUrl}`
  );
  next();
};

// Configure morgan logger based on environment
const morganLogger = (env) => {
  if (env === 'development') {
    return morgan('dev');
  }
  return morgan('combined');
};

module.exports = {
  logger,
  morganLogger
};