import { bot } from '../bot.js';

var getInfoByEmail = require('../../models/db/methods/userInfo').getInfoByEmail;
bot.dialog('/fullInfo', [
  function(session) {
    getInfoByEmail(session.userData.profile.email, function(answer) {
      session.send(answer);
      session.endDialog();
    });
  }
]);
