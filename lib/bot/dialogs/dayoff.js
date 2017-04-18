'use strict';

var _bot = require('../bot.js');

var _botbuilder = require('botbuilder');

var _botbuilder2 = _interopRequireDefault(_botbuilder);

var _moment = require('moment');

var _moment2 = _interopRequireDefault(_moment);

var _models = require('../../models');

function _interopRequireDefault(obj) { return obj && obj.__esModule ? obj : { default: obj }; }

_bot.bot.dialog('/dayoff', [function (session) {
	_botbuilder2.default.Prompts.text(session, 'how many days ?');
}, function (session, results) {
	session.userData.dayOff = { dayOffCount: parseInt(results.response, 10) };
	_botbuilder2.default.Prompts.text(session, 'whats up ?');
}, function (session, results) {
	session.userData.dayOff.reason = results.response;
	_botbuilder2.default.Prompts.text(session, 'What time would you like to set an day off  for? (dd.mm)');
}, function (session, results, reason) {
	var dayOffCount = session.userData.dayOff.dayOffCount;

	var dayMonth = results.response.split('.');
	var day = dayMonth[0];
	var month = dayMonth[1];
	var date = (0, _moment2.default)({ month: month, date: day })._d;
	var startsAt = (0, _moment2.default)(date)._d;
	var endsAt = (0, _moment2.default)(startsAt).clone().add(dayOffCount, 'days');
	var type = 'dayoff';
	var dayoff = {
		startsAt: startsAt,
		endsAt: endsAt,
		type: type,
		comment: session.userData.dayOff.reason,
		user: session.userData.profile.name,
		responses: []
	};
	session.userData.dayoff = dayoff;

	var DayOff = new _models.Event(dayoff);
	DayOff.save(function (err) {
		if (err) {
			console.log(err);
		}
	});

	// session.userData.time = builder.EntityRecognizer.resolveTime([results.response]);
	session.userData.time = _botbuilder2.default.EntityRecognizer.resolveTime([startsAt]);

	var card = createHeroCard(session, reason);
	var msg = new _botbuilder2.default.Message(session).addAttachment(card);
	session.send(msg);

	session.endDialogWithResult();
	session.beginDialog('/menu');
}]);

function createHeroCard(session, reason) {
	var imageUrl = 'http://2.bp.blogspot.com/-AJcBRl3gmJk/VPdRVHoEa5I/AAAAAAAAaTU/' + '23keCkkciQQ/s1600/keep-calm-and-have-a-day-off-3.png';
	var _session$userData$day = session.userData.dayoff,
	    startsAt = _session$userData$day.startsAt,
	    endsAt = _session$userData$day.endsAt;

	var diff = (0, _moment2.default)(endsAt).diff((0, _moment2.default)(startsAt), 'days');
	var dayoffs = diff > 1 ? (0, _moment2.default)(startsAt).format('MMMM Do YYYY') + ' - ' + (0, _moment2.default)(endsAt).format('MMMM Do YYYY') : (0, _moment2.default)(startsAt).format('MMMM Do YYYY');
	return new _botbuilder2.default.HeroCard(session).title('Day off for  %s', session.userData.profile.name).text('Reason: " %s "', reason).text('AT: " %s "', dayoffs).images([_botbuilder2.default.CardImage.create(session, imageUrl)]).buttons([_botbuilder2.default.CardAction.openUrl(session, 'https://www.google.com.ua/', 'Send(to mc)')]);
}