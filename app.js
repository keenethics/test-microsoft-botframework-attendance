require('dotenv-extended').load();

var restify = require('restify');
var builder = require('botbuilder');

var MongoClient = require('mongodb').MongoClient
  , assert = require('assert');
  
 
// Connection URL 
//var url = 'mongodb://localhost:27017/skypebot';
var url = 'mongodb://keenpeople:Suwuz123@ds141410.mlab.com:41410/heroku_5sb2kdth';
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
var intents = new builder.IntentDialog();
server.post('/api/messages', connector.listen());

//=========================================================
// Bots Dialogs
//=========================================================

bot.dialog('/', intents);


intents.matches(/^day off/i, [
  function (session){
    session.beginDialog('/dayoff');
  }
]);

intents.matches(/^createAlarm/i, [
  function (session){
   session.beginDialog('/createAlarm');  
  }  
]);

intents.onDefault([
    function (session, args, next) {
        if (!session.userData.name) {
        session.beginDialog('/ensureProfile', session.userData.profile);
        
        } else {
            next();
        }
    },
    function (session, results) {
      session.userData.profile = results.response;
    }
]);

bot.dialog('/ensureProfile', [
    function (session, args, next) {
        session.dialogData.profile = args || {};
        if (!session.dialogData.profile.name) {
            builder.Prompts.text(session, "HI! :) What's your full name?");
        } else {
            next();
        }
    },
    function (session, results, next) {
        if (results.response) {
            session.dialogData.profile.name = results.response;
        }
        if (!session.dialogData.profile.email) {
            builder.Prompts.text(session, "Enter your email please");
        } else {
            next();
        }
    },
    function (session, results ,next) {
        if (results.response) {
            session.dialogData.profile.email = results.response;
            session.send('Hello %(name)s! Your email is %(email)s!', session.dialogData.profile);
            session.send('Nice to meet you :)');
           //builder.Prompts.confirm(session, "Your data is right ?"); 
        }      
    //  session.userData.confirm = results.response;
      next();
    },
  
    function (session, results,next){
      builder.Prompts.text(session, "Your data is right ?");
      session.send('Just say : yes or no ');
      session.userData.confirm = results.response;
     console.log("SHHHIT",session.userData.confirm);
    },
   
   function (session,results,next) {
     //sobaka = results.response;
     //console.log("SHHHIT",session.userData.confirm);
     if (results.response){
     session.userData.confirm = results.response;
    console.log("SHHHIT",session.userData.confirm);
     if (session.userData.confirm == "yes"){
          var shit = session.dialogData.profile;
          MongoClient.connect(url, function(err, db) {
            assert.equal(null, err);
            insertDocument(db, function() {
              db.close();
            },shit);
          });
  session.endDialogWithResult({ response: session.dialogData.profile });
}
if(session.userData.confirm == "no"){
     session.send('So , forgot about all u write above :)');
      session.beginDialog('/ensureProfile'); 
   }
}
}
]);

bot.dialog('/dayoff' , [
  function (session){
      builder.Prompts.text(session,'whats up ?');

    },
  function (session,results){
      var reason = results.response;
      builder.Prompts.time(session, "What time would you like to set an day off  for?");   
  },
  function (session, results ,reason){
      //var reason = results.response;
      // create the card based on selection
      session.userData.time = builder.EntityRecognizer.resolveTime([results.response]);
      var card = createHeroCard(session, reason);
      var msg = new builder.Message(session).addAttachment(card);
      session.send(msg);
      session.endDialogWithResult();
  }
]);




var insertDocument = function(db, callback, profile) {
   console.log("ffff",profile);
   var currentdate = new Date(); 
   db.collection('users').insertOne( {
      "name" : profile.name,
      "email" : profile.email,
      "createdat" : currentdate
    }, function(err, result) {
    assert.equal(err, null);
   console.log("FFFF",profile);
    callback();
  });
};

function createHeroCard(session,reason) {
    return new builder.HeroCard(session)
        .title('Day off for  %s', session.userData.profile.name)
        .text('Reason: " %s "', reason)
        .text('AT: " %s "', session.userData.time)
        .images([
            builder.CardImage.create(session, 'http://2.bp.blogspot.com/-AJcBRl3gmJk/VPdRVHoEa5I/AAAAAAAAaTU/23keCkkciQQ/s1600/keep-calm-and-have-a-day-off-3.png')
        ])
        .buttons([
            builder.CardAction.openUrl(session,'https://www.google.com.ua/', 'Send(to mc)')
        ]);
}