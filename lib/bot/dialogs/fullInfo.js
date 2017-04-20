'use strict';

var _bot = require('../bot.js');

var _mongoose = require('mongoose');

var _mongoose2 = _interopRequireDefault(_mongoose);

function _interopRequireDefault(obj) { return obj && obj.__esModule ? obj : { default: obj }; }

_bot.bot.dialog('/fullInfo', [function (session) {
	var usersDB = _mongoose2.default.connection.model('Users');
	var holidays = _mongoose2.default.connection.model('Holidays');
	var workedMonths = null;
	holidays.findOne({ year: '2017' }, function (err, info) {
		workedMonths = info.months;
	});
	usersDB.findOne({ name: session.userData.profile.name }, function (err, user) {
		var answer = 'Sorry, not enough information. :(';
		if (user) {
			answer = 'Name: ' + user.name + '\n\n';
			answer += 'Email: ' + user.email + '\n\n';
			answer += 'Role: ' + user.role + '\n\n';
			answer += 'sickLeaveLeft: ' + user.sickLeaveLeft + '\n\n';
			answer += 'sickLeaveHalfLeft: ' + user.sickLeaveHalfLeft + '\n\n';
			var vacationDays = 0;
			user.workingInfo.map(function (year) {
				holidays.findOne({ year: year.year }, function (err, info) {
					workedMonths = info.months;
				});
				year.months.map(function (month, index) {
					vacationDays += 20 / 12 * (month.actuallyWorkedDays / workedMonths[index].totalWorkingDays);
				});
			});
			vacationDays -= user.usedVacations;
			answer += 'You have: ' + parseInt(vacationDays) + ' vacation days left';
		}
		session.send(answer);
	});
	session.endDialog();
}]);