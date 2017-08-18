import { bot } from '../bot.js';
import builder from 'botbuilder';
import mongoose from 'mongoose';
const usersDB = mongoose.connection.model('Users');

bot.dialog('/changeInfo', [
  function(session) {
    if (!session.userData.profile) {
      session.userData.profile = {};
    }
    if (session.userData.profile.role !== 'admin') {
      session.send('This feature available only for admins');
      session.endDialog();
      return;
    }
    builder.Prompts.text(session, 'Enter user\'s email(example@keenethics.com) whose information you want to change');
  },
  function(session, result) {
    session.dialogData.email = result.response;

    usersDB.findOne({email: session.dialogData.email}, (err, user) => {
      if (err) {
        console.error(err);
      }
      if (!user) {
        session.send('user not found');
        session.endDialog();
        return;
      }
      session.dialogData.newRole = user && user.role === 'admin' ? 'user' : 'admin';

      builder.Prompts.text(session,
        `User\'s role is "${user.role}". Send "yes" to change it to "${session.dialogData.newRole}".`);
    });
  },
  function(session, result) {
    const answer = result.response;
    if (/^yes/i.test(answer)) {
      usersDB.findOneAndUpdate(
        {email: session.dialogData.email},
        {role: session.dialogData.newRole},
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
    if (/^yes/i.test(answer)) {
      builder.Prompts.text(session, 'Enter start working day in dd.mm.yyyy format');
    } else {
      session.send('Returning to the main menu');
      session.endDialog();
    }
  },
  function(session, result) {
    const newStartWorkingDay = result.response;
    usersDB.findOneAndUpdate(
      {email: session.dialogData.email},
      {startWorkingDay: new Date(newStartWorkingDay)},
      () => {
        session.send('The start working day was changed.');
        session.endDialog();
      }
    );
  }
]).cancelAction('cancelAction', 'Ok, canceled.', {
  matches: /^nevermind$|^cancel$/i
});
