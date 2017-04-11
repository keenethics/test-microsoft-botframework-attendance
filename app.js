import Event from './models/event';
import moment from 'moment';
import mongoose from 'mongoose';
require('dotenv-extended').load();
import restify from 'restify';
import builder from 'botbuilder';

import { bot } from './bot/bot.js';
import server from './bot/server.js';
import dialogs from './bot/dialogs';

var MongoClient = require('mongodb').MongoClient
  , assert = require('assert');
  
const url = 'mongodb://localhost:27017/skypebot';
 
var confirm = false;



bot.dialog('/', new builder.IntentDialog()
    .onDefault('/getstarted')

  );
bot.dialog('/menu', new builder.IntentDialog()

    .matches(/^help/i,builder.DialogAction.send("You can : 1. day off  2.createAlarm  3.editprofile") )
    .matches(/^day off/i, '/dayoff')
    .matches(/^createAlarm/i, '/createAlarm')
    .matches(/^ensureProfile/i, '/ensureProfile')
    .onDefault(builder.DialogAction.send("You can : 1. day off  2.createAlarm  3.editprofile"))

);
bot.dialog('/getstarted',[

function (session, args, next , results) {
    if (confirm == false) {
    session.beginDialog('/ensureProfile', session.userData.profile);
    
    } else {
        next();

    }
},
function (session, results) {
  session.beginDialog('/menu', session.userData.profile);
  session.send("You can : 1. чday off  2. createAlarm  3. editprofile  4. help");
}
]);

bot.dialog('/ensureProfile', [
    function (session, args, next) {
        if (!session.userData) session.userData = {}
        session.userData.profile = args || {};
        if (!session.userData.profile.name) {
            builder.Prompts.text(session, "HI! :) What's your full name?");
        } else {
            next();
        }
    },
    function (session, results, next) {
        if (results.response) {
            session.userData.profile.name = results.response;
        }
        if (!session.userData.profile.email) {
            builder.Prompts.text(session, "Enter your email please");
        } else {
            next();
        }
    },
    function (session, results ,next) {
        if (results.response) {
            session.userData.profile.email = results.response;
            session.send('Hello %(name)s! Your email is %(email)s!', session.userData.profile);
            session.send('Nice to meet you :)');
            confirm = true;   var shit = session.userData.profile;
              MongoClient.connect(url, function(err, db) {
                assert.equal(null, err);
                insertDocument(db, function() {
                  db.close();
                },shit);
              }); 
        } else {
            next();
        }     
    confirm = true; 
     session.endDialogWithResult({ response: session.userData.profile });
    },

]);

var insertDocument = function(db, callback, profile) {
   var currentdate = new Date(); 
   db.collection('users').insertOne( {
      "name" : profile.name,
      "email" : profile.email,
      "createdat" : currentdate
    }, function(err, result) {
    assert.equal(err, null);
    callback();
  });
};
