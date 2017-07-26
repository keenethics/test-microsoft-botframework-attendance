'use strict';

var _bot = require('../bot.js');

var _botbuilder = require('botbuilder');

var _botbuilder2 = _interopRequireDefault(_botbuilder);

var _users = require('../helpers/users.js');

function _interopRequireDefault(obj) { return obj && obj.__esModule ? obj : { default: obj }; }

function _asyncToGenerator(fn) { return function () { var gen = fn.apply(this, arguments); return new Promise(function (resolve, reject) { function step(key, arg) { try { var info = gen[key](arg); var value = info.value; } catch (error) { reject(error); return; } if (info.done) { resolve(value); } else { return Promise.resolve(value).then(function (value) { step("next", value); }, function (err) { step("throw", err); }); } } return step("next"); }); }; }

_bot.bot.dialog('/settings', [function () {
  var _ref = _asyncToGenerator(regeneratorRuntime.mark(function _callee(session) {
    var user, notificationTime, time, msg;
    return regeneratorRuntime.wrap(function _callee$(_context) {
      while (1) {
        switch (_context.prev = _context.next) {
          case 0:
            if (!(session.userData.profile.role !== 'admin')) {
              _context.next = 4;
              break;
            }

            session.send('This feature available only for admins');
            session.endDialog();
            return _context.abrupt('return');

          case 4:
            _context.next = 6;
            return (0, _users.getUserByEmail)(session.userData.profile.email);

          case 6:
            user = _context.sent;

            session.dialogData.adminId = user && user._id;
            notificationTime = user && user.settings && user.settings.notificationTime;
            time = notificationTime ? notificationTime.hours + ':' + notificationTime.minutes : 'is not set';
            msg = 'Your notification time ' + time;

            session.send(msg);
            session.send('1. set notification time 2. menu 3. settings');
            _botbuilder2.default.Prompts.text(session, ' ?');

          case 14:
          case 'end':
            return _context.stop();
        }
      }
    }, _callee, this);
  }));

  return function (_x) {
    return _ref.apply(this, arguments);
  };
}(), function (session, result) {
  var action = result.response;
  switch (action) {
    case 'menu':
      session.beginDialog('/menu');
      break;
    case 'settings':
      session.beginDialog('/settings');
      break;
    case 'set notification time':
      session.send('enter desired notification time (hh:mm)');
      break;
    default:
      session.send('incorrect data.. going to the main menu..');
      session.endDialog();
      session.beginDialog('/menu');
      break;
  }
  _botbuilder2.default.Prompts.text(session, ' ?');
}, function (session, result) {
  var time = result.response;
  var timeExp = /^([0-9]|0[0-9]|1[0-9]|2[0-3]):[0-5][0-9]$/;
  var passed = timeExp.test(time);
  if (passed) {
    (0, _users.setNotificationTime)(session.dialogData.adminId, time);
    session.send('notification time ' + time + ' has been set');
    session.endDialog();
  } else {
    session.send('time format is incorrect');
  }
}]).cancelAction('cancelAction', 'Ok, canceled.', {
  matches: /^nevermind$|^cancel$/i
});