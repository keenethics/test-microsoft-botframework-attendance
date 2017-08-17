import { bot } from '../bot.js';
import builder from 'botbuilder';
import { eventsOf, addHoliday, holidaysOn, attendance } from './dialogExpressions.js';
import { addQuotes, addQuotesToRegExp } from '../helpers/dialogs.js';

bot.dialog('/', new builder.IntentDialog()
    .onDefault('/getstarted')
  );
bot.dialog('/menu', new builder.IntentDialog()
    .matches(/^help/i,'/help')
    .matchesAny([/^day off/i, addQuotes('day off')], '/dayoff')
  .matchesAny([/^day off/i, /<.+?>[[].+].+: <\/.+?>((day off)([A-Za-z@.\s])*)+<.+?>.+<\/.+?>/], '/dayoff')
    .matchesAny([/^vacation/i, addQuotes('vacation')], '/vacation')
    .matchesAny([/^edit profile/i, addQuotes('edit profile')], '/editProfile')
    .matchesAny([/^info on/i, addQuotes('info on.*')],  '/infoOn')
    .matchesAny([/^my upcoming events/i, addQuotes('my upcoming events')], '/activeEvents')
    .matchesAny([/^requests waiting for my action/i, addQuotes('requests waiting for my action')], '/requestsWaiting')
    .matchesAny([/^settings/i, addQuotes('settings')], '/settings')
    .matchesAny([/^change info/i, addQuotes('change info')], '/changeInfo')
    .matchesAny([/^change user info/i, addQuotes('change user info')], '/changeUserInfo')
    .matchesAny([/^i am admin/i, addQuotes('i am admin')], '/iAmAdmin')
    .matchesAny([holidaysOn, addQuotesToRegExp(holidaysOn)], '/holidays')
    .matchesAny([eventsOf, addQuotesToRegExp(eventsOf)], '/eventsOfEmail')
    .matchesAny([addHoliday, addQuotesToRegExp(addHoliday)], '/addHoliday')
    .matchesAny([attendance, addQuotesToRegExp(attendance)], '/attendance')
    .matches(/^What\'s [a-zA-z0-9_.]+@keenethics.com status on [0-9]{2}\.[0-9]{2}\.[0-9]{4}/i, '/userStatus')
    .matchesAny([/^ensureProfile/i, addQuotes(/^ensureProfile/i)], '/ensureProfile')
    .matchesAny([/^newUserRegistration/i, addQuotes(/^newUserRegistration/i)], '/newUserRegistration')
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
