'use strict';

var _models = require('../../models');

module.exports = function (db) {
	db.connection.collections['users'].drop(function (err) {
		if (err) {
			console.log(err);
			return;
		}
		console.log('----dropped users');
	});
	var users = [];
	var workingDays = [20, 19, 21, 20, 21, 20, 20, 20, 21, 20, 21, 21];

	var name = 'tester';
	var email = 'tester@gmail.com';
	var usedVacations = 2;
	var workedActually = [19, 18, 20, 20, 10, 0, 0, 0, 0, 0, 0, 0];
	users.push(new _models.Users({ name: name, email: email, usedVacations: usedVacations, workedActually: workedActually, workingDays: workingDays }));

	name = 'foo';
	email = 'foo@mail.com';
	usedVacations = 0;
	workedActually = [0, 11, 15, 10, 5, 10, 11, 0, 0, 0, 0, 0];
	users.push(new _models.Users({ name: name, email: email, usedVacations: usedVacations, workedActually: workedActually, workingDays: workingDays }));

	name = 'bar';
	email = 'bar@yandex.com';
	usedVacations = 3;
	workedActually = [0, 0, 0, 0, 5, 10, 11, 13, 15, 16, 17, 0];
	users.push(new _models.Users({ name: name, email: email, usedVacations: usedVacations, workedActually: workedActually, workingDays: workingDays }));

	name = 'foobar';
	email = 'foobar@yahoo.com';
	usedVacations = 0;
	workedActually = [0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 17, 21];
	users.push(new _models.Users({ name: name, email: email, usedVacations: usedVacations, workedActually: workedActually, workingDays: workingDays }));

	users.map(function (u) {
		u.save(function (err) {
			if (err) {
				console.log(err);
			}
		});
	});
};