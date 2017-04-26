import { bot } from '../bot.js';
import builder from 'botbuilder';

var getInfoByUsername = require('../../models/db/methods/userInfo').getInfoByUsername;
bot.dialog('/userInfo', [
  function(session) {
    if (session.userData.profile.role != 'admin') {
      session.send('This feature available only for admins');
      session.endDialog();
      return;
    }
    builder.Prompts.text(session, 'Enter username about which you want get information');
  },
  function(session, result) {
    getInfoByUsername(result.response, function(answer) {
      session.send(answer);
      session.endDialog();
    });
  }
]);
