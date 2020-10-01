/* global __dirname, exports */
exports.path = require('path')
exports.APP_DIR = exports.path.resolve(__dirname, 'javascript')

exports.entry = {
  Create: exports.APP_DIR + '/Create/index.jsx',
  OrgList: exports.APP_DIR + '/OrgList/index.jsx',
  SettingList: exports.APP_DIR + '/SettingList/index.jsx',
  TripList: exports.APP_DIR + '/TripList/index.jsx',
}
