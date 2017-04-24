import { Users, Holidays } from '../../models';

import mongoose from 'mongoose';

module.exports = () => {
	dropAllCollections(false);
	mongoose.connection.model('Holidays').find({}, (err, d) => {
		if (!d.length) {
			fillHolidaysIfEmpty();
		}
	});

	mongoose.connection.model('Users').find({}, (err, d) => {
		if (!d.length) {
			fillUsersIfEmpty();
		}
	});
};


let fillHolidaysIfEmpty = () => {
	let holiday = {year: 2017, months: []};
	let months = [
		{name: 'January',
			holidays: [new Date(2017, 0, 2), new Date(2017, 0, 9)]},
		{name:'February'},
		{name:'March',
			holidays: [new Date(2017, 2, 8)]},
		{name:'April',
			holidays: [new Date(2017, 3, 17)]},
		{name:'May',
			holidays: [new Date(2017, 4, 1), new Date(2017, 4, 2), new Date(2017, 4, 9)]},
		{name:'June',
			holidays: [new Date(2017, 5, 5), new Date(2017, 5, 28)]},
		{name:'July'},
		{name:'August',
			holidays: [new Date(2017, 7, 24)]},
		{name:'September'},
		{name:'October',
			holidays: [new Date(2017, 9, 16)]},
		{name:'November'},
		{name:'December'}];

	let days = ['Sunday', 'Monday', 'Tuesday', 'Wednesday', 'Thursday', 'Friday', 'Saturday'];
	months.map((m, index) => {
		let numberOfDaysInMonth = new Date(holiday.year, index+1, 0).getDate();
		let workingDays = 0;
		while(numberOfDaysInMonth) {
			let day = new Date(holiday.year, index, numberOfDaysInMonth);
			if (days[day.getDay()] != 'Sunday' && days[day.getDay()] != 'Saturday') {
				let isHoliday = false;
				if (m.holidays) {
					m.holidays.map((hDay) => {
						if (hDay.getTime() == day.getTime()) isHoliday = true;
					});
				}
				if (!isHoliday) ++workingDays;
			}
			--numberOfDaysInMonth;
		}
		holiday.months.push({month: m.name, totalWorkingDays: workingDays, holidaysDate: m.holidays});
	});
	new Holidays(holiday).save((err) => {
		if(err) {
			console.log('--->',err);
		} else {
			console.log('db.holidays was filled');
		}
	});
};


let fillUsersIfEmpty = () => {
	let months = ['January', 'February', 'March', 'April', 'May', 'June', 'July', 'August',
		'September', 'October', 'November', 'December'];
	let workedDaysInMonth = [10, 20, 22, 11];
	let user = {};
	let name = 'tester';
	let role = 'user';
	let email = 'tester@gmail.com';
	let usedVacations = 0;
	let sickLeaveLeft = 5;
	let sickLeaveHalfLeft = 10;
	let workingInfo = [];
	let workingYear = {year: 2017, months: []};
	let events = [];
	workedDaysInMonth.map((workedDays, index) => {
		workingYear.months.push({month: months[index], actuallyWorkedDays: workedDays});
	});
	workingInfo.push(workingYear);
	user = {name, role, email,usedVacations, sickLeaveLeft, sickLeaveHalfLeft, workingInfo, events};
	new Users(user).save((err) => {
		if(err) {
			console.log('--->',err);
		} else {
			console.log('db.users was filled with user \"' + name + '\"');
		}
	});

	workedDaysInMonth = [0, 0, 5, 6];
	user = {};
	name = 'admin';
	role = 'admin';
	email = 'admin@gmail.com';
	usedVacations = 0;
	sickLeaveLeft = 1;
	sickLeaveHalfLeft = 4;
	workingInfo = [];
	workingYear = {year: 2017, months: []};
	workedDaysInMonth.map((workedDays, index) => {
		workingYear.months.push({month: months[index], actuallyWorkedDays: workedDays});
	});
	workingInfo.push(workingYear);
	user = {name, role, email,usedVacations, sickLeaveLeft, sickLeaveHalfLeft, workingInfo, events};
	new Users(user).save((err) => {
		if(err) {
			console.log('--->',err);
		} else {
			console.log('db.users was filled with user \"' + name + '\"');
		}
	});

};


let dropAllCollections = (toDrop) => {
	if (!toDrop) return;
	mongoose.connection.model('Holidays').remove((err) => {
		if (err) {
			console.log(err);
		} else {
			console.log('db.holidays was dropped');
		}
	});

	mongoose.connection.model('Users').remove((err) => {
		if (err) {
			console.log(err);
		} else {
			console.log('db.users was dropped');
		}
	});

	mongoose.connection.model('Event').remove((err) => {
		if (err) {
			console.log(err);
		} else {
			console.log('db.events was dropped');
		}
	});
};
