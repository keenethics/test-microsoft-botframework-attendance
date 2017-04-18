import { Users } from '../../models';

module.exports = (db) => {
	db.connection.collections['users'].drop(function(err) {
		if (err) {
			console.log(err);
			return;
		}
		console.log('----dropped users');
	});
	let users = [];
	let workingDays = [20, 19, 21, 20, 21, 20, 20, 20, 21, 20, 21, 21];

	let name = 'tester';
	let email = 'tester@gmail.com';
	let usedVacations = 2;
	let workedActually = [19, 18, 20, 20, 10, 0, 0, 0, 0, 0, 0, 0];
	users.push(new Users({name, email, usedVacations, workedActually, workingDays}));

	name = 'foo';
	email = 'foo@mail.com';
	usedVacations = 0;
	workedActually = [0, 11, 15, 10, 5, 10, 11, 0, 0, 0, 0, 0];
	users.push(new Users({name, email, usedVacations, workedActually, workingDays}));

	name = 'bar';
	email = 'bar@yandex.com';
	usedVacations = 3;
	workedActually = [0, 0, 0, 0, 5, 10, 11, 13, 15, 16, 17, 0];
	users.push(new Users({name, email, usedVacations, workedActually, workingDays}));

	name = 'foobar';
	email = 'foobar@yahoo.com';
	usedVacations = 0;
	workedActually = [0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 17, 21];
	users.push(new Users({name, email, usedVacations, workedActually, workingDays}));

	users.map(u => {
		u.save((err) => {if (err) { console.log(err); }});
	});
};
