import { bot } from '../bot.js';

var getInfoByUsername = require('../../models/db/methods/usersMethods').getInfoByUsername;
bot.dialog('/fullInfo', [
  function(session) {
    getInfoByUsername(session.userData.profile.name, function(answer) {
      session.send(answer);
      session.endDialog();
    });
  }
]);
