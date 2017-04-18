'use strict';

var _bot = require('../bot.js');

var _botbuilder = require('botbuilder');

var _botbuilder2 = _interopRequireDefault(_botbuilder);

function _interopRequireDefault(obj) { return obj && obj.__esModule ? obj : { default: obj }; }

//let confirm = false;

_bot.bot.dialog('/ensureProfile', [function (session, args, next) {
	if (!session.userData) session.userData = {};
	session.userData.profile = args || {};
	if (!session.userData.profile.name) {
		_botbuilder2.default.Prompts.text(session, 'HI! :) What\'s your full name?');
	} else {
		next();
	}
}, function (session, results, next) {
	if (results.response) {
		session.userData.profile.name = results.response;
	}
	if (!session.userData.profile.email) {
		_botbuilder2.default.Prompts.text(session, 'Enter your email please');
	} else {
		next();
	}
}, function (session, results, next) {
	if (results.response) {
		session.userData.profile.email = results.response;
		session.send('Hello %(name)s! Your email is %(email)s!', session.userData.profile);
		session.send('Nice to meet you :)');
		//confirm = true;
		//var shit = session.userData.profile;
		// MongoClient.connect(url, function(err, db) {
		//   assert.equal(null, err);
		//   insertDocument(db, function() {
		//     db.close();
		//   },shit);
		// });
	} else {
		next();
	}
	//confirm = true; 
	session.endDialogWithResult({ response: session.userData.profile });
}]);

//var insertDocument = function(db, callback, profile) {
//	var currentdate = new Date();
//	db.collection('users').insertOne( {
//		'name' : profile.name,
//		'email' : profile.email,
//		'createdat' : currentdate
//	}, function(err, result) {
//		assert.equal(err, null);
//		callback();
//	});
//};