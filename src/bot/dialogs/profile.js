import { bot } from '../bot.js';
import builder from 'botbuilder';

//let confirm = false;
var getRoleByUsername = require('../../models/db/methods/userInfo').getRoleByUsername;

bot.dialog('/ensureProfile', [
  function (session, args, next) {
    if (!session.userData) session.userData = {};
    session.userData.profile = args || {};
    if (!session.userData.profile.name) {
      builder.Prompts.text(session, 'HI! :) What\'s your full name?');
    } else {
      next();
    }
  },
  function (session, results, next) {
    if (results.response) {
      session.userData.profile.name = results.response;
    }
    if (!session.userData.profile.email) {
      builder.Prompts.text(session, 'Enter your email please');
    } else {
      next();
    }
  },
  function (session, results ,next) {
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
    getRoleByUsername(session.userData.profile.name, function(role) {
      session.userData.profile.role = role;
      session.endDialogWithResult({ response: session.userData.profile });
    });
  },

]);

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
