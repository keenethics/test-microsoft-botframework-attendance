import { bot } from '../bot.js';
import builder from 'botbuilder';
import emailHelper from '../helpers/emailHelper';

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
    let userEmail = result.response;
    if (emailHelper.checkEmailOnTags(userEmail)) {
      userEmail = emailHelper.getEmailOutOfTag(userEmail);
    }
    getInfoByEmail(userEmail, function(answer) {
      session.send(answer);
      session.endDialog();
    });
  }
]);
