'use strict';

var _bot = require('../bot.js');

var _botbuilder = require('botbuilder');

var _botbuilder2 = _interopRequireDefault(_botbuilder);

var _moment = require('moment');

var _moment2 = _interopRequireDefault(_moment);

var _dayoff = require('./dayoff');

var _dayoff2 = _interopRequireDefault(_dayoff);

function _interopRequireDefault(obj) { return obj && obj.__esModule ? obj : { default: obj }; }

_bot.bot.dialog('/vacation', [function (session) {
  _botbuilder2.default.Prompts.text(session, 'how many vocation days do you want ?');
}, function (session, results) {
  session.userData.vacationCount = parseInt(results.response, 10);
  _botbuilder2.default.Prompts.text(session, 'What date do you want to start your vocation ? (dd.mm.yyyy)');
}, function (session, results, next) {
  var vacationCount = session.userData.vacationCount;

  var dayMonth = results.response.split('.');
  var day = dayMonth[0];
  var month = dayMonth[1];
  var year = dayMonth[2];
  var date = (0, _moment2.default)({ month: month, date: day, year: year })._d;
  var startsAt = (0, _moment2.default)(date)._d;
  var endsAt = (0, _moment2.default)(startsAt).clone().add(vacationCount, 'days')._d;
  var type = 'dayoff';
  var dayoff = {
    isVacation: true,
    startsAt: startsAt,
    endsAt: endsAt,
    type: type,
    comment: 'vocation',
    user: session.userData.profile.name,
    responses: []
  };
  session.userData.dayoff = dayoff;
  (0, _dayoff2.default)(dayoff, session.userData.profile.name);
  next();
}, function (session) {
  var dayoff = session.userData.dayoff;

  var startsAt = (0, _moment2.default)(dayoff.startsAt).format('MMMM Do YYYY');
  var endsAt = (0, _moment2.default)(dayoff.endsAt).format('MMMM Do YYYY');
  session.send('request for vocation for ' + startsAt + '-' + endsAt + ' has been sent');
  session.endDialog();
  session.beginDialog('/menu');
}]).cancelAction('cancelAction', 'Ok, canceled.', {
  matches: /^nevermind$|^cancel$/i
});