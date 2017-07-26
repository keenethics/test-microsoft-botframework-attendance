'use strict';

Object.defineProperty(exports, "__esModule", {
  value: true
});
exports.checkUserAvailabilityOnDate = exports.getEventsOnDate = exports.approveOrRejectEvent = exports.getUsers = exports.getPendingEvents = exports.getEventsByIds = exports.cancelEvent = exports.getEventDate = exports.saveEventIntoUser = exports.saveEvent = exports.getHolidays = undefined;

var _mongoose = require('mongoose');

var _mongoose2 = _interopRequireDefault(_mongoose);

var _moment = require('moment');

var _moment2 = _interopRequireDefault(_moment);

var _event = require('../../models/event.js');

var _event2 = _interopRequireDefault(_event);

var _users = require('../../models/users.js');

var _users2 = _interopRequireDefault(_users);

function _interopRequireDefault(obj) { return obj && obj.__esModule ? obj : { default: obj }; }

function _defineProperty(obj, key, value) { if (key in obj) { Object.defineProperty(obj, key, { value: value, enumerable: true, configurable: true, writable: true }); } else { obj[key] = value; } return obj; }

var getHolidays = exports.getHolidays = function getHolidays() {
  return new Promise(function (resolve, reject) {
    var holidays = _mongoose2.default.connection.model('Holidays');
    holidays.find({ year: 2017 }, function (err, info) {
      if (err) {
        reject(err.reason);
      } else {
        var workedMonths = info[0] && info[0].months;
        resolve(workedMonths);
      }
    });
  });
};

var saveEvent = exports.saveEvent = function saveEvent(dayoff) {
  return new Promise(function (resolve, reject) {
    var DayOff = new _event2.default(dayoff);
    var _id = DayOff._id;

    DayOff.save(function (err) {
      if (err) {
        reject(null);
      } else {
        resolve(_id);
      }
    });
  });
};

var saveEventIntoUser = exports.saveEventIntoUser = function saveEventIntoUser(userId, eventId) {
  return new Promise(function (resolve, reject) {
    _users2.default.update({ _id: userId }, { $addToSet: { events: eventId } }, function (err) {
      if (err) {
        reject(err);
      } else {
        resolve('success');
      }
    });
  });
};

var getEventDate = exports.getEventDate = function getEventDate(event) {
  var startsAt = event.startsAt,
      endsAt = event.endsAt;

  var diff = (0, _moment2.default)(endsAt).diff((0, _moment2.default)(startsAt), 'days');
  var dayoffs = diff > 1 ? (0, _moment2.default)(startsAt).format('MMMM Do YYYY') + ' - ' + (0, _moment2.default)(endsAt).format('MMMM Do YYYY') : (0, _moment2.default)(startsAt).format('MMMM Do YYYY');
  return dayoffs;
};

var cancelEvent = exports.cancelEvent = function cancelEvent(eventId) {
  return new Promise(function (resolve, reject) {
    _event2.default.remove({ _id: eventId }, function (err) {
      if (err) {
        reject(false);
      }
      resolve(true);
    });
  });
};

var getEventsByIds = exports.getEventsByIds = function getEventsByIds(ids) {
  var options = arguments.length > 1 && arguments[1] !== undefined ? arguments[1] : {};

  return new Promise(function (resolve, reject) {
    var query = { _id: { $in: ids } };
    var queryWithOptions = Object.assign({}, query, options);
    _event2.default.find(queryWithOptions).sort('startsAt').exec(function (err, data) {
      if (err) {
        reject(err);
      }
      resolve(data);
    });
  });
};

var getPendingEvents = exports.getPendingEvents = function getPendingEvents(adminId) {
  return new Promise(function (resolve, reject) {
    var notRejected = { rejected: { $ne: '' + adminId } };
    var notApproved = { approved: { $ne: '' + adminId } };
    _event2.default.find({ $and: [notRejected, notApproved] }).sort('startsAt').exec(function (err, data) {
      if (err) {
        reject(err);
      }
      resolve(data);
    });
  });
};

var getUsers = exports.getUsers = function getUsers(userIds) {
  return new Promise(function (resolve, reject) {
    var query = { _id: { $in: userIds } };
    _users2.default.find(query).select('email name _id').exec(function (err, data) {
      if (err) {
        reject(err);
      }
      resolve(data);
    });
  });
};

var approveOrRejectEvent = exports.approveOrRejectEvent = function approveOrRejectEvent(eventId, adminId, action) {
  return new Promise(function (resolve, reject) {
    var query = { _id: eventId };
    var projection = { $addToSet: _defineProperty({}, action, adminId) };
    _event2.default.update(query, projection).exec(function (err, data) {
      if (err) {
        reject(err);
      }
      resolve(data);
    });
  });
};

var getEventsOnDate = exports.getEventsOnDate = function getEventsOnDate(startDate, endDate, email, status) {
  return new Promise(function (resolve, reject) {
    var startsAtCondition = { startsAt: { $gte: '' + startDate } };
    var noEndDateCondition = { startsAt: { $lte: '' + (0, _moment2.default)(startDate).clone().add('1', 'days')._d } };
    var endsAtCondition = { startsAt: { $lte: '' + endDate } };
    var and = [startsAtCondition].concat([endDate ? endsAtCondition : noEndDateCondition]);
    if (email) and.push({ user: email });
    if (status == 'approved') {
      and.push({ $and: [{ $where: 'this.approved.length > 0' }, { rejected: { $size: 0 } }] });
    }
    if (status == 'rejected') {
      and.push({ $where: 'this.rejected.length > 0' });
    }
    if (status == 'pending') {
      and.push({ $and: [{ approved: { $size: 0 } }, { rejected: { $size: 0 } }] });
    }
    var query = { $and: and };
    _event2.default.find(query).sort('startsAt').exec(function (err, data) {
      if (err) {
        reject(err);
      }
      resolve(data);
    });
  });
};

var checkUserAvailabilityOnDate = exports.checkUserAvailabilityOnDate = function checkUserAvailabilityOnDate(userEmail, date) {
  return new Promise(function (resolve, reject) {
    _users2.default.findOne({ email: userEmail }, function (err, user) {
      if (err) {
        reject('Sorry, something go wrong. :(');
        console.error(err);
      } else if (user) {
        getEventsByIds(user.events, {
          startsAt: {
            $lte: (0, _moment2.default)(date, 'DD.MM.YYYY').toDate()
          },
          endsAt: {
            $gte: (0, _moment2.default)(date, 'DD.MM.YYYY').toDate()
          }
        }).then(function (events) {
          if (events.length) {
            resolve('He is on vacation');
          } else {
            resolve('He should be working on that date');
          }
        });
      } else {
        reject('User is not found.');
      }
    });
  });
};