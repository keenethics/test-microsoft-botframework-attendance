import { bot } from '../bot.js';
import builder from 'botbuilder';

let confirm = false;

bot.dialog('/', new builder.IntentDialog()
    .onDefault('/getstarted')

  );
bot.dialog('/menu', new builder.IntentDialog()

    .matches(/^help/i,builder.DialogAction.send('You can : 1. day off  2.createAlarm  3.editprofile 4.full info \
    5.vacation') )
    .matches(/^day off/i, '/dayoff')
    .matches(/^vacation/i, '/vacation')
    .matches(/^createAlarm/i, '/createAlarm')
    .matches(/^ensureProfile/i, '/ensureProfile')
    .matches(/^full info/i, '/fullInfo')
    .matches(/^user info/i, '/userInfo')
    .onDefault(builder.DialogAction.send('You can : 1. day off  2.createAlarm  3.editprofile 4.full info \
    5. vacation '))

);
bot.dialog('/getstarted',[

  function (session, args, next) {
    if (confirm == false) {
      session.beginDialog('/ensureProfile', session.userData.profile);
    
    } else {
      next();

    }
  },
  function (session) {
    session.beginDialog('/menu', session.userData.profile);
    session.send('You can : 1. чday off  2. createAlarm  3. editprofile  4. help');
  }
]);
