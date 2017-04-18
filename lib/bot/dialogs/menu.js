'use strict';

var _bot = require('../bot.js');

var _botbuilder = require('botbuilder');

var _botbuilder2 = _interopRequireDefault(_botbuilder);

function _interopRequireDefault(obj) { return obj && obj.__esModule ? obj : { default: obj }; }

var confirm = false;

_bot.bot.dialog('/', new _botbuilder2.default.IntentDialog().onDefault('/getstarted'));
_bot.bot.dialog('/menu', new _botbuilder2.default.IntentDialog().matches(/^help/i, _botbuilder2.default.DialogAction.send('You can : 1. day off  2.createAlarm  3.editprofile 4.full info')).matches(/^day off/i, '/dayoff').matches(/^createAlarm/i, '/createAlarm').matches(/^ensureProfile/i, '/ensureProfile').matches(/^full info/i, '/fullInfo').onDefault(_botbuilder2.default.DialogAction.send('You can : 1. day off  2.createAlarm  3.editprofile 4.full info')));
_bot.bot.dialog('/getstarted', [function (session, args, next) {
	if (confirm == false) {
		session.beginDialog('/ensureProfile', session.userData.profile);
	} else {
		next();
	}
}, function (session) {
	session.beginDialog('/menu', session.userData.profile);
	session.send('You can : 1. чday off  2. createAlarm  3. editprofile  4. help');
}]);