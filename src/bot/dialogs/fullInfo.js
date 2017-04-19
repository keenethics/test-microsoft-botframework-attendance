import { bot } from '../bot.js';
import mongoose from 'mongoose';

bot.dialog('/fullInfo', [
	function(session) {
		var usersDB = mongoose.connection.model('Users');
		var holidays = mongoose.connection.model('Holidays');
		var workedMonths = null;
		holidays.findOne({year: '2017'}, (err, info) => {
			workedMonths = info.months;
		});
		usersDB.findOne({name: session.userData.profile.name}, function(err, user) {
			var answer = 'Sorry, not enough information. :(';
			if (user) {
				answer = 'Name: ' + user.name + '\n\n';
				answer += 'Email: ' + user.email + '\n\n';
				answer += 'Role: ' + user.role + '\n\n';
				answer += 'sickLeaveLeft: ' + user.sickLeaveLeft + '\n\n';
				answer += 'sickLeaveHalfLeft: ' + user.sickLeaveHalfLeft + '\n\n';
				var vacationDays = 0;
				user.workingInfo.map((year) => {
					holidays.findOne({year: year.year}, (err, info) => {
						workedMonths = info.months;
					});
					year.months.map((month, index) => {
						vacationDays += (20 / 12) * (month.actuallyWorkedDays / workedMonths[index].totalWorkingDays);
					});
				});
				vacationDays -= user.usedVacations;
				answer += 'You have: ' + parseInt(vacationDays) + ' vacation days left';
			}
			session.send(answer);
		});
		session.endDialog();
	}
]);
