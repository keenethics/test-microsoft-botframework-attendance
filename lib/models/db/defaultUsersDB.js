'use strict';

var _models = require('../../models');

var _mongoose = require('mongoose');

var _mongoose2 = _interopRequireDefault(_mongoose);

function _interopRequireDefault(obj) { return obj && obj.__esModule ? obj : { default: obj }; }

module.exports = function () {
	dropAllCollections(false);
	_mongoose2.default.connection.model('Holidays').find({}, function (err, d) {
		d.length;
		if (!d.length) {
			fillHolidaysIfEmpty();
		}
	});

	_mongoose2.default.connection.model('Users').find({}, function (err, d) {
		d.length;
		if (!d.length) {
			fillUsersIfEmpty();
		}
	});
};

var fillHolidaysIfEmpty = function fillHolidaysIfEmpty() {
	var holiday = { year: 2017, months: [] };
	var months = [{ name: 'January',
		holidays: [new Date(2017, 0, 2), new Date(2017, 0, 9)] }, { name: 'February' }, { name: 'March',
		holidays: [new Date(2017, 2, 8)] }, { name: 'April',
		holidays: [new Date(2017, 3, 17)] }, { name: 'May',
		holidays: [new Date(2017, 4, 1), new Date(2017, 4, 2), new Date(2017, 4, 9)] }, { name: 'June',
		holidays: [new Date(2017, 5, 5), new Date(2017, 5, 28)] }, { name: 'July' }, { name: 'August',
		holidays: [new Date(2017, 7, 24)] }, { name: 'September' }, { name: 'October',
		holidays: [new Date(2017, 9, 16)] }, { name: 'November' }, { name: 'December' }];

	var days = ['Sunday', 'Monday', 'Tuesday', 'Wednesday', 'Thursday', 'Friday', 'Saturday'];
	months.map(function (m, index) {
		var numberOfDaysInMonth = new Date(holiday.year, index + 1, 0).getDate();
		var workingDays = 0;

		var _loop = function _loop() {
			var day = new Date(holiday.year, index, numberOfDaysInMonth);
			if (days[day.getDay()] != 'Sunday' && days[day.getDay()] != 'Saturday') {
				var isHoliday = false;
				if (m.holidays) {
					m.holidays.map(function (hDay) {
						if (hDay.getTime() == day.getTime()) isHoliday = true;
					});
				}
				if (!isHoliday) ++workingDays;
			}
			--numberOfDaysInMonth;
		};

		while (numberOfDaysInMonth) {
			_loop();
		}
		holiday.months.push({ month: m.name, totalWorkingDays: workingDays, holidaysDate: m.holidays });
	});
	new _models.Holidays(holiday).save(function (err) {
		if (err) {
			console.log('--->', err);
		} else {
			console.log('db.holidays was filled');
		}
	});
};

var fillUsersIfEmpty = function fillUsersIfEmpty() {
	var months = ['January', 'February', 'March', 'April', 'May', 'June', 'July', 'August', 'September', 'October', 'November', 'December'];
	var workedDaysInMonth = [10, 20, 22, 11];
	var user = {};
	var name = 'tester';
	var role = 'user';
	var email = 'tester@gmail.com';
	var usedVacations = 0;
	var sickLeaveLeft = 5;
	var sickLeaveHalfLeft = 10;
	var workingInfo = [];
	var workingYear = { year: 2017, months: [] };
	var events = [];
	workedDaysInMonth.map(function (workedDays, index) {
		workingYear.months.push({ month: months[index], actuallyWorkedDays: workedDays });
	});
	workingInfo.push(workingYear);
	user = { name: name, role: role, email: email, usedVacations: usedVacations, sickLeaveLeft: sickLeaveLeft, sickLeaveHalfLeft: sickLeaveHalfLeft, workingInfo: workingInfo, events: events };
	new _models.Users(user).save(function (err) {
		if (err) {
			console.log('--->', err);
		} else {
			console.log('db.users was filled with user \"' + name + '\"');
		}
	});
};

var dropAllCollections = function dropAllCollections(toDrop) {
	if (!toDrop) return;
	_mongoose2.default.connection.model('Holidays').remove(function (err) {
		if (err) {
			console.log(err);
		} else {
			console.log('db.holidays was dropped');
		}
	});

	_mongoose2.default.connection.model('Users').remove(function (err) {
		if (err) {
			console.log(err);
		} else {
			console.log('db.users was dropped');
		}
	});

	_mongoose2.default.connection.model('Event').remove(function (err) {
		if (err) {
			console.log(err);
		} else {
			console.log('db.events was dropped');
		}
	});
};