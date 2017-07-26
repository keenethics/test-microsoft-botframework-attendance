'use strict';

var _bot = require('../bot.js');

var _botbuilder = require('botbuilder');

var _botbuilder2 = _interopRequireDefault(_botbuilder);

var _users = require('../helpers/users.js');

var _events = require('../helpers/events.js');

function _interopRequireDefault(obj) { return obj && obj.__esModule ? obj : { default: obj }; }

function _asyncToGenerator(fn) { return function () { var gen = fn.apply(this, arguments); return new Promise(function (resolve, reject) { function step(key, arg) { try { var info = gen[key](arg); var value = info.value; } catch (error) { reject(error); return; } if (info.done) { resolve(value); } else { return Promise.resolve(value).then(function (value) { step("next", value); }, function (err) { step("throw", err); }); } } return step("next"); }); }; }

_bot.bot.dialog('/events', [function () {
  var _ref = _asyncToGenerator(regeneratorRuntime.mark(function _callee(session) {
    var user, events, displayEvents;
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
            _context.next = 10;
            return (0, _events.getPendingEvents)(user._id);

          case 10:
            events = _context.sent;

            session.dialogData.mappedEvents = {};
            events.forEach(function (ev, index) {
              session.dialogData.mappedEvents[index] = ev._id;
            });
            displayEvents = events.map(function (ev, index) {
              return index + ' - ' + (0, _events.getEventDate)(ev) + ' ' + ev.type + ' reason: ' + ev.comment + ' user: ' + ev.user;
            });

            displayEvents.forEach(function (ev) {
              session.send(ev);
            });
            session.send('to reject/approve event type "reject/approve {number}"');
            session.send('type "menu" to go to the main menu');
            _botbuilder2.default.Prompts.text(session, ' ?');

          case 18:
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
  var adminId = session.dialogData.adminId;
  var mappedEvents = session.dialogData.mappedEvents;

  var expMenu = /^menu$/;
  var rejectExp = /^reject [0-9]+/;
  var approveExp = /^approve [0-9]+/;
  var number = action.replace(/^\D+/g, '');
  var eventId = mappedEvents[number];
  if (expMenu.test(action)) {
    session.beginDialog('/menu');
  }

  var approve = approveExp.test(action);
  var reject = rejectExp.test(action);
  var confirmEvent = approve ? 'approved' : 'rejected';
  var success = (0, _events.approveOrRejectEvent)(eventId, adminId, confirmEvent);
  if (success) {
    session.send('event ' + mappedEvents[number] + ' has been ' + (reject ? 'rejected' : 'approved'));
  } else {
    session.send('ops... something wrong');
  }
  session.send('type "menu" to go to the main menu');
  _botbuilder2.default.Prompts.text(session, ' ?');
}, function (session, result) {
  switch (result.response) {
    case 'menu':
      session.beginDialog('/menu');
      break;
    default:
      session.beginDialog('/rejected');
      break;
  }
}]).cancelAction('cancelAction', 'Ok, canceled.', {
  matches: /^nevermind$|^cancel$/i
});