import { bot } from '../bot.js';
import builder from 'botbuilder';

var getInfoByEmail = require('../../models/db/methods/userInfo').getInfoByEmail;
bot.dialog('/userInfo', [
  function(session) {
    if (session.userData.profile.role != 'admin') {
      session.send('This feature available only for admins');
      session.endDialog();
      return;
    }
    builder.Prompts.text(session, 'Enter user"s email(example@keenethics.com) about whom you want get information');
  },
  function(session, result) {
    getInfoByEmail(result.response, function(answer) {
      session.send(answer);
      session.endDialog();
    });
  }
]);
