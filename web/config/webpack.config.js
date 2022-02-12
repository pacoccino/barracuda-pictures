const escapeRegExp = require('lodash.escaperegexp')

/** @returns {import('webpack').Configuration} Webpack Configuration */
module.exports = (config, { mode }) => {
  //if (mode === 'development') {}

  config.devServer.proxy['/s3'] = {
    target: 'http://[::1]:9000',
    pathRewrite: {
      [`^${escapeRegExp('/s3')}`]: '',
    },
  }

  return config
}
