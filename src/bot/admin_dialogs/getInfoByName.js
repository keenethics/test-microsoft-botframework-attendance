import { bot } from '../bot.js';
import builder from 'botbuilder';
const getInfoByName = require('../../models/db/methods/userInfo').getInfoByName;

bot.dialog('/userInfoByName', [
  function(session) {
    if (session.userData.profile.role !== 'admin') {
      session.send('This feature available only for admins');
      session.endDialog();
      return;
    }
    builder.Prompts.text(session, 'Enter user\'s name about whom you want get information');
  },
  function(session, result) {
    let userName = result.response;

    getInfoByName(userName, function(answer) {
      session.send(answer);
      session.endDialog();
      session.beginDialog('/menu');
    });
  }
]).endConversationAction(
  'returnToMainMenu', 'Returning to main menu',
  {
    matches: /^cancel$/i
  }
);
