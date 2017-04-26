'use strict';

var _bot = require('../bot.js');

var _botbuilder = require('botbuilder');

var _botbuilder2 = _interopRequireDefault(_botbuilder);

var _moment = require('moment');

var _moment2 = _interopRequireDefault(_moment);

var _models = require('../../models');

var _future = require('fibers/future');

var _future2 = _interopRequireDefault(_future);

var _fibers = require('fibers');

var _fibers2 = _interopRequireDefault(_fibers);

var _mongoose = require('mongoose');

var _mongoose2 = _interopRequireDefault(_mongoose);

var _momentRange = require('moment-range');

function _interopRequireDefault(obj) { return obj && obj.__esModule ? obj : { default: obj }; }

var moment = (0, _momentRange.extendMoment)(_moment2.default);

var workedMonths = [];
var user = {};

function getHolidays(date) {
	var holidays = _mongoose2.default.connection.model('Holidays');
	var fiber = _fibers2.default.current;
	holidays.find({ year: 2017 }, function (err, info) {
		workedMonths = info[0] && info[0].months;
		fiber.run();
	});
	_fibers2.default.yield();
}

function saveEvent(dayoff) {
	var DayOff = new _models.Event(dayoff);
	DayOff.save(function (err) {
		if (err) {
			console.log(err);
		}
		console.log('saved......');
	});
}

function getUser(userName) {
	var users = _mongoose2.default.connection.model('Users');
	var fiber = _fibers2.default.current;
	users.findOne({ name: userName }, function (err, info) {
		user = info;
		fiber.run();
	});
	_fibers2.default.yield();
}

_bot.bot.dialog('/dayoff', [function (session) {
	_botbuilder2.default.Prompts.text(session, 'how many days do you want ?');
}, function (session, results) {
	session.userData.dayOff = { dayOffCount: parseInt(results.response, 10) };
	_botbuilder2.default.Prompts.text(session, 'whats up ?');
}, function (session, results) {
	session.userData.dayOff.reason = results.response;
	_botbuilder2.default.Prompts.text(session, 'What time would you like to set an day off  for? (dd.mm.yyyy)');
}, function (session, results, reason) {
	var dayOffCount = session.userData.dayOff.dayOffCount;

	var dayMonth = results.response.split('.');
	var day = dayMonth[0];
	var month = dayMonth[1];
	var year = dayMonth[2];
	var date = moment({ month: month, date: day, year: year })._d;
	var startsAt = moment(date)._d;
	var endsAt = moment(startsAt).clone().add(dayOffCount, 'days')._d;

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
	var monthName = moment().month(month).format('MMMM');
	(0, _fibers2.default)(function () {
		if (!workedMonths.length) getHolidays(new Date());

		// calculate dayofs holidays
		var currentMonth = workedMonths.filter(function (m) {
			return m.month === monthName;
		})[0];
		var range = moment.range(startsAt, endsAt);

		var officialHolidaysDuringDayoff = currentMonth.holidaysDate.filter(function (hd) {
			return moment(hd).within(range);
		});
		var dayOffCount = moment(endsAt).diff(moment(startsAt), 'days') - officialHolidaysDuringDayoff.length;
		// vacationsUsed
		// daysOffUsed

		getUser(session.userData.profile.name);
		var workedMonthsObject = {};
		workedMonths.forEach(function (wM) {
			return workedMonthsObject[wM.month] = wM.totalWorkingDays;
		});
		var actuallyWorked = user.workingInfo.filter(function (wI) {
			return wI.year === parseInt(year, 10);
		})[0];
		var actuallyWorkedObject = {};
		actuallyWorked.months.forEach(function (aW) {
			return actuallyWorkedObject[aW.month] = aW.actuallyWorkedDays;
		});
		var vacations = 0;
		for (var keys in actuallyWorkedObject) {
			vacations += actuallyWorkedObject[keys] / workedMonthsObject[keys] * 1.66;
		}

		var _user = user,
		    usedVacations = _user.usedVacations;


		var enabledVacationsForEvent = vacations - usedVacations;
		var vacationsUsed = dayOffCount;
		var daysOffUsed = 0;

		if (enabledVacationsForEvent < dayOffCount) {
			vacationsUsed = enabledVacationsForEvent;
			daysOffUsed = dayOffCount - enabledVacationsForEvent;
		}

		console.log("sum");
		console.log(sum);

		console.log("vacationsUsed");
		console.log(vacationsUsed);
		console.log("daysOffUsed");
		console.log(daysOffUsed);

		// const vocationAvailable = 	.map(wM => wM.totalWorkingDays)


		saveEvent(dayoff);
	}).run();

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

	var diff = moment(endsAt).diff(moment(startsAt), 'days');
	var dayoffs = diff > 1 ? moment(startsAt).format('MMMM Do YYYY') + ' - ' + moment(endsAt).format('MMMM Do YYYY') : moment(startsAt).format('MMMM Do YYYY');
	return new _botbuilder2.default.HeroCard(session).title('Day off for  %s', session.userData.profile.name).text('Reason: " %s "', reason).text('AT: " %s "', dayoffs).images([_botbuilder2.default.CardImage.create(session, imageUrl)]).buttons([_botbuilder2.default.CardAction.openUrl(session, 'https://www.google.com.ua/', 'Send(to mc)')]);
}