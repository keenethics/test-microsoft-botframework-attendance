import { bot } from '../bot.js';
import builder from 'botbuilder';
import { eventsOf, addHoliday, holidaysOn, attendance } from './dialogExpressions.js';

bot.dialog('/', new builder.IntentDialog()
    .onDefault('/getstarted')
);

bot.dialog('/menu', new builder.IntentDialog()
    .matches(/^help/i,'/help')
    .matches(/day off\s*$/i, '/dayoff')
    .matches(/day off\S*/i, '/dayoffShortCommand')
    .matches(/^edit profile/i, '/editProfile')
    .matches(/^info on/i, '/infoOn')
    .matches(/^my upcoming events/i, '/activeEvents')
    .matches(/^requests waiting for my action/i, '/requestsWaiting')
    .matches(/^settings/i, '/settings')
    .matches(/^change info/i, '/changeInfo')
    .matches(/^change user info/i, '/changeUserInfo')
    .matches(/^i am admin/i, '/iAmAdmin')
    .matches(holidaysOn, '/holidays')
    .matches(eventsOf, '/eventsOfEmail')
    .matches(addHoliday, '/addHoliday')
    .matches(attendance, '/attendance')
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
