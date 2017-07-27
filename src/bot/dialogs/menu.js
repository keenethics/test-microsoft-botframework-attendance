import { bot } from '../bot.js';
import builder from 'botbuilder';
import { eventsOn } from './dialogExpressions.js';

bot.dialog('/', new builder.IntentDialog()
    .onDefault('/getstarted')

  );

bot.dialog('/menu', new builder.IntentDialog()
    .matches(/^help/i,'/help' )
    .matches(/^day off/i, '/dayoff')
    .matches(/^vacation/i, '/vacation')
    .matches(/^edit profile/i, '/editProfile')
    .matches(/^info on/i, '/infoOn')
    .matches(/^active events/i, '/activeEvents')
    .matches(/^settings/i, '/settings')
    .matches(/^change info/i, '/changeInfo')
    .matches(/^confirm events/i, '/events')
    .matches(/^change user info/i, '/changeUserInfo')
    .matches(eventsOn, '/eventsOnDate')
    .matches(/^What\'s [a-zA-z0-9_.]+@keenethics.com status on [0-9]{2}\.[0-9]{2}\.[0-9]{4}/i, '/userStatus')
    .matches(/^ensureProfile/i, '/ensureProfile')
    .matches(/^newUserRegistration/i, '/newUserRegistration')
    .onDefault('/help')
);


bot.dialog('/getstarted', [
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
