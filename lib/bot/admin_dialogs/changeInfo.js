'use strict';

var _bot = require('../bot.js');

var _botbuilder = require('botbuilder');

var _botbuilder2 = _interopRequireDefault(_botbuilder);

var _mongoose = require('mongoose');

var _mongoose2 = _interopRequireDefault(_mongoose);

function _interopRequireDefault(obj) { return obj && obj.__esModule ? obj : { default: obj }; }

var usersDB = _mongoose2.default.connection.model('Users');

_bot.bot.dialog('/changeInfo', [function (session) {
  if (session.userData.profile.role !== 'admin') {
    session.send('This feature available only for admins');
    session.endDialog();
    return;
  }
  _botbuilder2.default.Prompts.text(session, 'Enter user\'s email(example@keenethics.com) whose information you want to change');
}, function (session, result) {
  session.dialogData.email = result.response;

  usersDB.findOne({ email: session.dialogData.email }, function (err, user) {
    if (err) {
      console.error(err);
    }

    session.dialogData.newRole = user.role === 'admin' ? 'user' : 'admin';

    _botbuilder2.default.Prompts.text(session, 'User\'s role is "' + user.role + '". Send "yes" to change it to "' + session.dialogData.newRole + '".');
  });
}, function (session, result) {
  var answer = result.response;
  if (answer.indexOf('yes') !== -1) {
    usersDB.findOneAndUpdate({ email: session.dialogData.email }, { role: session.dialogData.newRole }, function () {
      session.send('The role was changed.');
    });
  } else {
    session.send('Canceled');
  }
  _botbuilder2.default.Prompts.text(session, 'Wanna change astronaut\'s start working day?');
}, function (session, result) {
  var answer = result.response;
  if (answer.indexOf('yes') !== -1) {
    _botbuilder2.default.Prompts.text(session, 'Enter start working day in dd.mm.yyyy format');
  } else {
    session.send('Returning to the main menu');
    session.endDialog();
  }
}, function (session, result) {
  var newStartWorkingDay = result.response;
  usersDB.findOneAndUpdate({ email: session.dialogData.email }, { startWorkingDay: new Date(newStartWorkingDay) }, function () {
    session.send('The start working day was changed.');
    session.endDialog();
  });
}]).cancelAction('cancelAction', 'Ok, canceled.', {
  matches: /^nevermind$|^cancel$/i
});