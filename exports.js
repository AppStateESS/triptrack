/* global __dirname, exports */
exports.path = require('path')
exports.APP_DIR = exports.path.resolve(__dirname, 'javascript')

exports.entry = {
  AdminTripForm: exports.APP_DIR + '/AdminTripForm/index.jsx',
  MemberTripForm: exports.APP_DIR + '/MemberTripForm/index.jsx',
  OrgList: exports.APP_DIR + '/OrgList/index.jsx',
  TripList: exports.APP_DIR + '/TripList/index.jsx',
  ImportForm: exports.APP_DIR + '/ImportForm/index.jsx',
  MemberList: exports.APP_DIR + '/MemberList/index.jsx',
  SettingList: exports.APP_DIR + '/SettingList/index.jsx',
  EmailMembers: exports.APP_DIR + '/EmailMembers/index.jsx',
  Reports: exports.APP_DIR + '/Reports/index.jsx',
  Approval: exports.APP_DIR + '/Approval/index.jsx',
  EngageMember: exports.APP_DIR + '/EngageMember/index.jsx',
}
