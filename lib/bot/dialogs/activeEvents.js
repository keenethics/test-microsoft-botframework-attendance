'use strict';

var _moment = require('moment');

var _moment2 = _interopRequireDefault(_moment);

var _bot = require('../bot.js');

var _botbuilder = require('botbuilder');

var _botbuilder2 = _interopRequireDefault(_botbuilder);

var _users = require('../helpers/users.js');

var _events = require('../helpers/events.js');

function _interopRequireDefault(obj) { return obj && obj.__esModule ? obj : { default: obj }; }

function _asyncToGenerator(fn) { return function () { var gen = fn.apply(this, arguments); return new Promise(function (resolve, reject) { function step(key, arg) { try { var info = gen[key](arg); var value = info.value; } catch (error) { reject(error); return; } if (info.done) { resolve(value); } else { return Promise.resolve(value).then(function (value) { step("next", value); }, function (err) { step("throw", err); }); } } return step("next"); }); }; }

_bot.bot.dialog('/pending', [function () {
  var _ref = _asyncToGenerator(regeneratorRuntime.mark(function _callee(session) {
    var user, events, sortedEvents, displayEvents;
    return regeneratorRuntime.wrap(function _callee$(_context) {
      while (1) {
        switch (_context.prev = _context.next) {
          case 0:
            session.send('your events ' + session.userData.profile.email + ' ');
            _context.next = 3;
            return (0, _users.getUserByEmail)(session.userData.profile.email);

          case 3:
            user = _context.sent;
            _context.next = 6;
            return (0, _events.getEventsByIds)(user.events, { startsAt: { $gt: new Date() },
              rejected: { $size: 0 } });

          case 6:
            events = _context.sent;
            sortedEvents = events;

            session.dialogData.mappedEvents = {};
            sortedEvents.forEach(function (ev, index) {
              session.dialogData.mappedEvents[index] = ev._id;
            });
            displayEvents = sortedEvents.map(function (ev, index) {
              return index + ' - ' + (0, _events.getEventDate)(ev) + ' ' + ev.type + ' reason: ' + ev.comment;
            });

            session.dialogData.displayEvents = displayEvents;
            session.send('your events ' + session.userData.profile.email + ' ');
            displayEvents.forEach(function (ev) {
              session.send(ev);
            });
            session.send('to cancel event type "cancel {number}"');
            session.send('type "menu" to go to the main menu');
            _botbuilder2.default.Prompts.text(session, ' ?');

          case 17:
          case 'end':
            return _context.stop();
        }
      }
    }, _callee, this);
  }));

  return function (_x) {
    return _ref.apply(this, arguments);
  };
}(), function (session, results) {
  var _session$dialogData = session.dialogData,
      mappedEvents = _session$dialogData.mappedEvents,
      displayEvents = _session$dialogData.displayEvents;

  var action = results.response;
  var expMenu = /^menu$/;
  var exp = /^cancel [0-9]+/;
  var number = action.replace(/^\D+/g, '');
  var dialogId = mappedEvents[number];
  if (expMenu.test(action)) {
    session.beginDialog('/menu');
  } else if (exp.test(action)) {
    var success = (0, _events.cancelEvent)(dialogId);
    if (success) {
      session.send('event ' + displayEvents[number] + ' has been canceled');
    } else {
      session.send('ops... something wrong');
    }
  } else {
    session.send('type correct query');
    session.beginDialog('/activeEvents');
  }
}]).cancelAction('cancelAction', 'Ok, canceled.', {
  matches: /^nevermind$|^cancel$/i
});

_bot.bot.dialog('/rejected', [function () {
  var _ref2 = _asyncToGenerator(regeneratorRuntime.mark(function _callee2(session) {
    var user, events;
    return regeneratorRuntime.wrap(function _callee2$(_context2) {
      while (1) {
        switch (_context2.prev = _context2.next) {
          case 0:
            _context2.next = 2;
            return (0, _users.getUserByEmail)(session.userData.profile.email);

          case 2:
            user = _context2.sent;
            _context2.next = 5;
            return (0, _events.getEventsByIds)(user.events, { startsAt: { $gt: new Date() },
              'rejected.0': { $exists: true } });

          case 5:
            events = _context2.sent;

            events.forEach(function (ev, index) {
              session.send(index + ' - ' + (0, _events.getEventDate)(ev) + ' ' + ev.type + ' reason: ' + ev.comment);
            });
            session.send('rejected events');
            _botbuilder2.default.Prompts.text(session, '1.menu 2. active events');

          case 9:
          case 'end':
            return _context2.stop();
        }
      }
    }, _callee2, this);
  }));

  return function (_x2) {
    return _ref2.apply(this, arguments);
  };
}(), function (session, results) {
  switch (results.response) {
    case 'menu':
      session.beginDialog('/menu');
      break;
    case 'active events':
      session.beginDialog('/activeEvents');
      break;
    default:
      session.beginDialog('/rejected');
      break;
  }
}]).cancelAction('cancelAction', 'Ok, canceled.', {
  matches: /^nevermind$|^cancel$/i
});

_bot.bot.dialog('/approved', [function () {
  var _ref3 = _asyncToGenerator(regeneratorRuntime.mark(function _callee3(session) {
    var user, today, pastDate, events;
    return regeneratorRuntime.wrap(function _callee3$(_context3) {
      while (1) {
        switch (_context3.prev = _context3.next) {
          case 0:
            _context3.next = 2;
            return (0, _users.getUserByEmail)(session.userData.profile.email);

          case 2:
            user = _context3.sent;
            today = (0, _moment2.default)()._d;
            pastDate = (0, _moment2.default)(today).clone().subtract(2, 'd')._d;
            _context3.next = 7;
            return (0, _events.getEventsByIds)(user.events, { createdAt: { $lt: pastDate } });

          case 7:
            events = _context3.sent;

            events.forEach(function (ev, index) {
              session.send(index + ' - ' + (0, _events.getEventDate)(ev) + ' ' + ev.type + ' reason: ' + ev.comment);
            });
            session.send('rejected events');
            _botbuilder2.default.Prompts.text(session, '1.menu 2. active events');

          case 11:
          case 'end':
            return _context3.stop();
        }
      }
    }, _callee3, this);
  }));

  return function (_x3) {
    return _ref3.apply(this, arguments);
  };
}(), function (session, results) {
  switch (results.response) {
    case 'menu':
      session.beginDialog('/menu');
      break;
    case 'active events':
      session.beginDialog('/activeEvents');
      break;
    default:
      session.beginDialog('/approved');
      break;
  }
}]).cancelAction('cancelAction', 'Ok, canceled.', {
  matches: /^nevermind$|^cancel$/i
});

_bot.bot.dialog('/activeEvents', [function (session) {
  var options = ['pending', 'rejected', 'approved', 'menu'];
  session.dialogData.options = options;
  _botbuilder2.default.Prompts.text(session, '1.pending 2.rejected 3.approved 4.menu');
}, function (session, results) {
  var dialog = results.response;
  if (session.dialogData.options.indexOf(dialog) > -1) {
    session.beginDialog('/' + dialog);
  } else {
    session.send('what do you mean ?');
    session.beginDialog('/activeEvents');
  }
}]).cancelAction('cancelAction', 'Ok, canceled.', {
  matches: /^nevermind$|^cancel$/i
});