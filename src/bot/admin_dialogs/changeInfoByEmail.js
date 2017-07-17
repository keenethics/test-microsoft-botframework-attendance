import { bot } from '../bot.js';
import builder from 'botbuilder';
import mongoose from 'mongoose';
const usersDB = mongoose.connection.model('Users');

const tempUserInfo = {};

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
    tempUserInfo.email = result.response;

    usersDB.findOne({email: tempUserInfo.email}, (err, user) => {
      if (err) {
        console.error(err);
      }

      tempUserInfo.newRole = user.role === 'admin' ? 'user' : 'admin';

      builder.Prompts.text(session,
        `User\'s role is "${user.role}". Send "yes" to change it to "${tempUserInfo.newRole}".`);
    });
  },
  function(session, result) {
    const answer = result.response;
    if (answer.indexOf('yes') !== -1) {
      usersDB.findOneAndUpdate(
        {email: tempUserInfo.email},
        {role: tempUserInfo.newRole},
        () => {
          session.send('The role was changed.');
        }
      );
    } else {
      session.send('Canceled');
    }
    builder.Prompts.text(session, 'Wanna change astronaut\'s start working day?');
  },
  function(session, result) {
    const answer = result.response;
    if (answer.indexOf('yes') !== -1) {
      builder.Prompts.text(session, 'Enter start working day in dd.mm.yyyy format');
    } else {
      session.send('Returning to the main menu');
      session.endDialog();
    }
  },
  function(session, result) {
    const newStartWorkingDay = result.response;
    usersDB.findOneAndUpdate(
      {email: tempUserInfo.email},
      {startWorkingDay: new Date(newStartWorkingDay)},
      () => {
        session.send('The start working day was changed.');
        session.endDialog();
      }
    );
  }
]).endConversationAction(
  'returnToMainMenu', 'Returning to main menu',
  {
    matches: /^cancel$/i
  }
);

usersDB.findOneAndUpdate({email: 'taras.mazurkevych@keenethics.com'}, {role: 'admin'}, () => {});