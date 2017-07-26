'use strict';

var _bot = require('../bot.js');

var _botbuilder = require('botbuilder');

var _botbuilder2 = _interopRequireDefault(_botbuilder);

var _mongoose = require('mongoose');

var _mongoose2 = _interopRequireDefault(_mongoose);

var _emailHelper = require('../helpers/emailHelper');

var _emailHelper2 = _interopRequireDefault(_emailHelper);

function _interopRequireDefault(obj) { return obj && obj.__esModule ? obj : { default: obj }; }

var usersDB = _mongoose2.default.connection.model('Users');

_bot.bot.dialog('/editProfile', [function (session, args) {
  if (!args) {
    _botbuilder2.default.Prompts.text(session, 'Enter the new name');
  } else {
    _botbuilder2.default.Prompts.text(session, 'Enter valid name');
  }
}, function (session, newName) {
  if (!_emailHelper2.default.validateName(newName.response)) {
    session.send('Invalid name.');
    session.replaceDialog('/editProfile', { reprompt: true });
    return;
  }

  usersDB.findOneAndUpdate({ email: session.userData.profile.email }, { name: newName.response }, function (err) {
    if (err) {
      console.error(err);
    }
  });
  session.send('The name successfully changed, ' + newName.response + '!');
  session.endDialog();
}]).cancelAction('cancelAction', 'Ok, canceled.', {
  matches: /^nevermind$|^cancel$/i
});