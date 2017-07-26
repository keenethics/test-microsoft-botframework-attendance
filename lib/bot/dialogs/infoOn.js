'use strict';

var _bot = require('../bot.js');

var _emailHelper = require('../helpers/emailHelper');

var _emailHelper2 = _interopRequireDefault(_emailHelper);

function _interopRequireDefault(obj) { return obj && obj.__esModule ? obj : { default: obj }; }

var getInfoByName = require('../../models/db/methods/userInfo').getInfoByName;
var getInfoByEmail = require('../../models/db/methods/userInfo').getInfoByEmail;

var sendDataAndEndDialog = function sendDataAndEndDialog(session, data) {
  session.send(data);
  session.endDialog();
  session.beginDialog('/menu');
};

_bot.bot.dialog('/infoOn', [function (session, result) {
  var answer = result.matched.input.slice(7).trim();

  if (answer === 'me') {
    getInfoByEmail(session.userData.profile.email, function (data) {
      sendDataAndEndDialog(session, data);
    });
  } else {
    // If user isn't admin end the dialog
    if (session.userData.profile.role !== 'admin') {
      sendDataAndEndDialog(session, 'This feature available only for admins');
      return;
    }

    // Check if answer is email address. If not, handle as a name
    if (_emailHelper2.default.validateEmail(answer)) {
      getInfoByEmail(answer, function (data) {
        sendDataAndEndDialog(session, data);
      });
    } else {
      getInfoByName(answer, function (data) {
        sendDataAndEndDialog(session, data);
      });
    }
  }
}]);