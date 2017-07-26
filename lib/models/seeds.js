'use strict';

Object.defineProperty(exports, "__esModule", {
  value: true
});

var _faker = require('faker');

var _faker2 = _interopRequireDefault(_faker);

var _mongoid = require('mongoid');

var _mongoid2 = _interopRequireDefault(_mongoid);

var _event = require('../models/event.js');

var _event2 = _interopRequireDefault(_event);

var _users = require('../models/users.js');

var _users2 = _interopRequireDefault(_users);

function _interopRequireDefault(obj) { return obj && obj.__esModule ? obj : { default: obj }; }

var fromDate = new Date('04.01.2017');
var toDate = new Date('12.12.2017');

var getNewUser = function getNewUser(_ref) {
  var _id = _ref._id,
      email = _ref.email,
      role = _ref.role,
      events = _ref.events;

  return {
    _id: _id || (0, _mongoid2.default)(),
    email: email || _faker2.default.internet.email(),
    events: events || [],
    workingInfo: [{}],
    role: role || new Date().getSeconds() % 2 == 0 ? 'user' : 'admin',
    sickLeaveHalfLeft: Math.floor(Math.random() * 10 + 1),
    sickLeaveLeft: Math.floor(Math.random() * 10 + 1),
    usedVacations: Math.floor(Math.random() * 10 + 1)
  };
};

var randomDate = function randomDate(start, end) {
  var diff = end.getTime() - start.getTime();
  var new_diff = diff * Math.random();
  return new Date(start.getTime() + new_diff);
};

var getNewEvent = function getNewEvent(_ref2) {
  var _id = _ref2._id,
      startsAt = _ref2.startsAt,
      endsAt = _ref2.endsAt,
      type = _ref2.type,
      comment = _ref2.comment,
      rejected = _ref2.rejected,
      approved = _ref2.approved,
      email = _ref2.email;

  var date1 = randomDate(fromDate, toDate);
  var date2 = randomDate(fromDate, toDate);
  return {
    _id: _id || (0, _mongoid2.default)(),
    endsAt: endsAt || date1 > date2 ? date1 : date2,
    startsAt: startsAt || date1 > date2 ? date2 : date1,
    type: type || 'dayoff',
    comment: comment || 'no comment',
    user: email,
    approved: approved || [],
    rejected: rejected || [],
    createdAt: new Date()
  };
};

var generateUsersAndEvents = function generateUsersAndEvents() {
  var admin = getNewUser({ role: 'admin' });
  var user = getNewUser({ role: 'user' });
  var approvedEvents = [];
  var rejectedEvents = [];
  var pendingEvents = [];
  for (var i = 0; i < 5; i++) {
    rejectedEvents.push(getNewEvent({ email: user.email, rejected: [admin._id], approved: [] }));
    approvedEvents.push(getNewEvent({ email: user.email, rejected: [], approved: [admin._id] }));
    pendingEvents.push(getNewEvent({ email: user.email, rejected: [], approved: [] }));
  }
  var events = rejectedEvents.concat(approvedEvents).concat(pendingEvents);
  user.events = events.map(function (e) {
    return e._id;
  });
  _users2.default.create([user, admin], function (err) {
    if (err) return err;
  });
  _event2.default.create(events);
};

exports.default = generateUsersAndEvents;