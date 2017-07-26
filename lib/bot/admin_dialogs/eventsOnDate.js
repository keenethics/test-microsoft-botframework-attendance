'use strict';

var _slicedToArray = function () { function sliceIterator(arr, i) { var _arr = []; var _n = true; var _d = false; var _e = undefined; try { for (var _i = arr[Symbol.iterator](), _s; !(_n = (_s = _i.next()).done); _n = true) { _arr.push(_s.value); if (i && _arr.length === i) break; } } catch (err) { _d = true; _e = err; } finally { try { if (!_n && _i["return"]) _i["return"](); } finally { if (_d) throw _e; } } return _arr; } return function (arr, i) { if (Array.isArray(arr)) { return arr; } else if (Symbol.iterator in Object(arr)) { return sliceIterator(arr, i); } else { throw new TypeError("Invalid attempt to destructure non-iterable instance"); } }; }();

var _bot = require('../bot.js');

var _date = require('../helpers/date.js');

var _events = require('../helpers/events.js');

var _users = require('../helpers/users.js');

var _dialogExpressions = require('../dialogs/dialogExpressions.js');

var _botbuilder = require('botbuilder');

var _botbuilder2 = _interopRequireDefault(_botbuilder);

function _interopRequireDefault(obj) { return obj && obj.__esModule ? obj : { default: obj }; }

function _asyncToGenerator(fn) { return function () { var gen = fn.apply(this, arguments); return new Promise(function (resolve, reject) { function step(key, arg) { try { var info = gen[key](arg); var value = info.value; } catch (error) { reject(error); return; } if (info.done) { resolve(value); } else { return Promise.resolve(value).then(function (value) { step("next", value); }, function (err) { step("throw", err); }); } } return step("next"); }); }; }

_bot.bot.dialog('/eventsOnDate', [function () {
  var _ref = _asyncToGenerator(regeneratorRuntime.mark(function _callee(session, args) {
    var statusExp, query, statusSpecified, queryString, emailSpecified, date, email, dateAndEmail, events, validDate, _date$split, _date$split2, startDate, endDate, displayEvents;

    return regeneratorRuntime.wrap(function _callee$(_context) {
      while (1) {
        switch (_context.prev = _context.next) {
          case 0:
            statusExp = /(rejected |approved |pending )/;

            session.send('welcome to events on dialog');
            query = args.matched.input;
            statusSpecified = query.match(statusExp) && query.match(statusExp)[0].trim();
            queryString = query.replace(/(rejected |approved |pending )*events on /, '');
            emailSpecified = _dialogExpressions.ofEmail.test(queryString);
            date = queryString;
            email = '';

            if (emailSpecified) {
              dateAndEmail = queryString.split(' of ');

              date = dateAndEmail[0];
              email = dateAndEmail[1];
            }
            events = [];
            validDate = (0, _date.validateDate)(date);

            if (validDate) {
              _context.next = 16;
              break;
            }

            session.send('incorect date...');
            session.endDialog();
            _context.next = 25;
            break;

          case 16:
            if (!(validDate == 2 || validDate == 1)) {
              _context.next = 25;
              break;
            }

            _date$split = date.split('-'), _date$split2 = _slicedToArray(_date$split, 2), startDate = _date$split2[0], endDate = _date$split2[1];
            _context.next = 20;
            return (0, _events.getEventsOnDate)((0, _date.getMomentDDMMFormat)(startDate), (0, _date.getMomentDDMMFormat)(endDate), email, statusSpecified);

          case 20:
            _context.t0 = function (a, b) {
              return a > b;
            };

            events = _context.sent.sort(_context.t0);

            session.dialogData.mappedEvents = {};
            displayEvents = events.map(function (ev, index) {
              return index + ' - ' + (0, _events.getEventDate)(ev) + ' ' + ev.type + ' reason: ' + ev.comment + ' user: ' + ev.user;
            });

            displayEvents.forEach(function (ev) {
              session.send(ev);
            });

          case 25:
            if (statusSpecified === 'pending') {
              session.dialogData.statusSpecified = statusSpecified;
              events.forEach(function (ev, index) {
                session.dialogData.mappedEvents[index] = ev._id;
              });
              _botbuilder2.default.Prompts.text(session, 'you can approve or reject event by typing "approve/reject {n}');
            } else {
              session.endDialog();
            }
            session.send('type "menu" to go back');

          case 27:
          case 'end':
            return _context.stop();
        }
      }
    }, _callee, this);
  }));

  return function (_x, _x2) {
    return _ref.apply(this, arguments);
  };
}(), function () {
  var _ref2 = _asyncToGenerator(regeneratorRuntime.mark(function _callee2(session, results) {
    var mappedEvents, action, queryExp, actionExp, toDo, index, eventId, user, success;
    return regeneratorRuntime.wrap(function _callee2$(_context2) {
      while (1) {
        switch (_context2.prev = _context2.next) {
          case 0:
            mappedEvents = session.dialogData.mappedEvents;
            action = results.response;

            if (action == 'menu') session.beginDialog('/menu');

            if (!(session.dialogData.statusSpecified === 'pending')) {
              _context2.next = 18;
              break;
            }

            queryExp = /(reject |approve )*[0-9]{1,3}/;

            if (queryExp.test(action)) {
              _context2.next = 9;
              break;
            }

            session.send('incorrect input');
            _context2.next = 18;
            break;

          case 9:
            actionExp = /(reject |approve )/;
            toDo = action.match(actionExp) && action.match(actionExp)[0].trim();
            index = parseInt(action.replace(actionExp, ''), 10);
            eventId = mappedEvents[index];
            _context2.next = 15;
            return (0, _users.getUserByEmail)(session.userData.profile.email);

          case 15:
            user = _context2.sent;
            success = (0, _events.approveOrRejectEvent)(eventId, user._id, toDo + 'd');

            if (success) {
              session.send('event ' + mappedEvents[index] + ' has been ' + toDo + 'd');
            } else {
              session.send('ops... something wrong');
            }

          case 18:
            session.endDialog();
            session.beginDialog('/menu');

          case 20:
          case 'end':
            return _context2.stop();
        }
      }
    }, _callee2, this);
  }));

  return function (_x3, _x4) {
    return _ref2.apply(this, arguments);
  };
}()]).cancelAction('cancelAction', 'Ok, canceled.', {
  matches: /^nevermind$|^cancel$/i
});