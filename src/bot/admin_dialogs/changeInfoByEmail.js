import { bot } from '../bot.js';
import builder from 'botbuilder';
import mongoose from 'mongoose';
const usersDB = mongoose.connection.model('Users');

const user = {};

bot.dialog('/changeUserInfo', [
  function(session) {
    if (session.userData.profile.role !== 'admin') {
      session.send('This feature available only for admins');
      session.endDialog();
      return;
    }
    builder.Prompts.text(session, 'Enter user\'s email(example@keenethics.com) whose information you want to change');
  },
  function(session, result) {
    user.email = result.response;
    usersDB.findOne({email: 'taras.mazurkevych@keenethics.com'}, (err, user) => {
      if (err) {
        console.error(err);
      }

      builder.Prompts.text(session,
        `User\'s role is ${user.role}. Send '+' to change it to ${user.role === 'admin' ? 'user' : 'admin'}`);
    });
  },
  function(session, result) {
    let answer = result.response;
    if (answer.indexOf('+')) {
      usersDB.findOneAndUpdate({email: user.email},
        {role: user.role === 'admin' ? 'user' : 'admin'}, () => {
          session.send('The role was changed.');
          session.endDialog();
        });
    } else {
      session.send('Canceled');
      session.endDialog();
    }
  }
]).endConversationAction(
  'returnToMainMenu', 'Returning to main menu',
  {
    matches: /^cancel$/i
  }
);
