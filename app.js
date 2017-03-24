require('dotenv-extended').load();

var restify = require('restify');
var builder = require('botbuilder');

var MongoClient = require('mongodb').MongoClient
  , assert = require('assert');
  
 
 //Connection URL 
var url = 'mongodb://suwuy123@gmail.com:Suwuz123@ds141410.mlab.com:41410/heroku_5sb2kdth';
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
server.listen(process.env.port || process.env.PORT || 8080, function () {
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
    session.beginDialog('/dayoff')
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
            builder.Prompts.text(session, "What's your full name?");
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
    function (session, results) {
        if (results.response) {
            session.dialogData.profile.email = results.response;
            session.send('Hello %(name)s! Your email is %(email)s!', session.dialogData.profile);
            session.send('Nice to meet you :)');
            var shit = session.dialogData.profile;
            MongoClient.connect(url, function(err, db) {
              assert.equal(null, err);
              insertDocument(db, function() {
                db.close();
              },shit);
            });
        }
        session.endDialogWithResult({ response: session.dialogData.profile });
    }
]);

bot.dialog('/dayoff' , [
  function (session){
      builder.Prompts.text(session,'whats up ?');

    },
  function (session, results){
      var reason = results.response;
      // create the card based on selection
      var card = createHeroCard(session, reason);
      var msg = new builder.Message(session).addAttachment(card);
      session.send(msg);
      session.endDialogWithResult();
  }
]);

var insertDocument = function(db, callback, profile) {
   console.log("ffff",profile);
   db.collection('users').insertOne( {
      "name" : profile.name,
      "email" : profile.email
   }, function(err, result) {
    assert.equal(err, null);
    callback();
  });
};

function createHeroCard(session,reason) {
    return new builder.HeroCard(session)
        .title('Day off for  %s', session.userData.profile.name)
        .text('Reason: " %s "', reason)
        .images([
            builder.CardImage.create(session, 'http://2.bp.blogspot.com/-AJcBRl3gmJk/VPdRVHoEa5I/AAAAAAAAaTU/23keCkkciQQ/s1600/keep-calm-and-have-a-day-off-3.png')
        ])
        .buttons([
            builder.CardAction.openUrl(session,'https://www.google.com.ua/', 'Send(to mc)')
        ]);
}