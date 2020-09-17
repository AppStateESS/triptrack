/* global __dirname, exports */
exports.path = require('path')
exports.APP_DIR = exports.path.resolve(__dirname, 'javascript')

exports.entry = {
  Create: exports.APP_DIR + '/Create/index.jsx',
}
