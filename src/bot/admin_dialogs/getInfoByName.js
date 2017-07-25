import { bot } from '../bot.js';
const getInfoByName = require('../../models/db/methods/userInfo').getInfoByName;

bot.dialog('/userInfoByName', [
  function(session, result) {
    if (session.userData.profile.role !== 'admin') {
      session.send('This feature available only for admins');
      session.endDialog();
      return;
    }

    const userName = result.matched.input.slice(7).trim();

    getInfoByName(userName, function(answer) {
      session.send(answer);
      session.endDialog();
      session.beginDialog('/menu');
    });
  },
]).endConversationAction(
  'returnToMainMenu', 'Returning to main menu',
  {
    matches: /^cancel$/i
  }
);
