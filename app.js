import Event from './models/event';
import moment from 'moment';
import mongoose from 'mongoose';


require('dotenv-extended').load();

var restify = require('restify');
var builder = require('botbuilder');

var MongoClient = require('mongodb').MongoClient
  , assert = require('assert');
  
 
// Connection URL 
mongoose.connect('mongodb://localhost:27017/skypebot');

var url = 'mongodb://localhost:27017/skypebot';

//var url = 'mongodb://keenpeople:Suwuz123@ds141410.mlab.com:41410/heroku_5sb2kdth'
 //Use connect method to connect to the Server 
MongoClient.connect(url, function(err, db) {
  assert.equal(null, err);
  console.log("Connected correctly to server");
 db.close();

});

//=========================================================
// Bot Setup
//=========================================================

// Setup Restify Server
var server = restify.createServer();
server.listen(process.env.port || process.env.PORT || 3978, function () {
   console.log('%s listening to %s', server.name, server.url); 
});
  
// Create chat bot
var connector = new builder.ChatConnector({
  appId: "607b6eb5-3eb4-4f2d-a0e9-38b471a4979a",
  appPassword: "9Yhoxk9oJyqo18Xog1hT4sH"
});
var bot = new builder.UniversalBot(connector);
//var intents = new builder.IntentDialog();
server.post('/api/messages', connector.listen());
var confirm = false
//=========================================================
// Bots Dialogs
//=========================================================
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

bot.dialog('/dayoff' , [

  function (session,  results) {
      builder.Prompts.text(session,'how many days ?');
  },

  function (session, results){
      session.userData.dayOff = { dayOffCount: parseInt(results.response,10) };
      builder.Prompts.text(session,'whats up ?');

    },
  function (session,results){
      session.userData.dayOff.reason = results.response; 
      builder.Prompts.text(session, "What time would you like to set an day off  for? (dd.mm)");   
  },
  function (session, results ,reason){
      const { dayOffCount } = session.userData.dayOff; 
      const dayMonth = results.response.split(".");
      const day = dayMonth[0];
      const month = dayMonth[1];
      const date = moment({month, date: day})._d;
      const startsAt = moment(date)._d;
      const endsAt = moment(startsAt).clone().add(dayOffCount, 'days');
      const type = "dayoff"; 
      const dayoff = {
        startsAt,
        endsAt,
        type,
        comment: session.userData.dayOff.reason,
        user: session.userData.profile.name,
        responses: [], 
      }
      session.userData.dayoff = dayoff;

      const DayOff = new Event(dayoff);
      DayOff.save((err, data) => {
        if (err) { console.log(err) }
      })

      // session.userData.time = builder.EntityRecognizer.resolveTime([results.response]);
      session.userData.time = builder.EntityRecognizer.resolveTime([startsAt]);
      
      var card = createHeroCard(session, reason);
      var msg = new builder.Message(session).addAttachment(card);
      session.send(msg);

      session.endDialogWithResult();
      session.beginDialog('/menu');
  }
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

function createHeroCard(session,reason) {
    const { startsAt, endsAt } = session.userData.dayoff;
    const diff = moment(endsAt).diff(moment(startsAt), 'days');
    const dayoffs = diff > 1 ? `${moment(startsAt).format('MMMM Do YYYY')} - ${moment(endsAt).format('MMMM Do YYYY')}`
    : moment(startsAt).format('MMMM Do YYYY');
    return new builder.HeroCard(session)
        .title('Day off for  %s', session.userData.profile.name)
        .text('Reason: " %s "', reason)
        .text('AT: " %s "', dayoffs)
        .images([
            builder.CardImage.create(session, 'http://2.bp.blogspot.com/-AJcBRl3gmJk/VPdRVHoEa5I/AAAAAAAAaTU/23keCkkciQQ/s1600/keep-calm-and-have-a-day-off-3.png')
        ])
        .buttons([
            builder.CardAction.openUrl(session,'https://www.google.com.ua/', 'Send(to mc)')
        ]);
}