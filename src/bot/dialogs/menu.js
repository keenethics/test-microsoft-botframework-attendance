import { bot } from '../bot.js';
import builder from 'botbuilder';


bot.dialog('/', new builder.IntentDialog()
    .onDefault('/getstarted')

  );
bot.dialog('/menu', new builder.IntentDialog()

    .matches(/^help/i,'/help' )
    .matches(/^day off/i, '/dayoff')
    .matches(/^vacation/i, '/vacation')
    .matches(/^edit profile/i, '/editProfile')
    .matches(/^full info/i, '/fullInfo')
    .matches(/^user info/i, '/userInfo')
    .matches(/^active events/i, '/activeEvents')
    .matches(/^change info/i, '/changeInfo')
    .onDefault('/help')

);
bot.dialog('/getstarted',[

  function (session, args, next) {
    if (session.userData.confirm == true) {
      next();

    } else {
      session.beginDialog('/ensureProfile', session.userData.profile);

    }
  },
  function (session) {
    session.beginDialog('/help');
    session.beginDialog('/menu', session.userData.profile);
  }
]).endConversationAction(
  'returnToMainMenu', 'Returning to main menu',
  {
    matches: /^cancel$/i
  }
);
