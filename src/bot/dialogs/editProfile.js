import { bot } from '../bot.js';
import builder from 'botbuilder';
import mongoose from 'mongoose';
import emailHelper from '../helpers/emailHelper';

const usersDB = mongoose.connection.model('Users');

bot.dialog('/editProfile', [
  function (session, args) {
    if (!args) {
      builder.Prompts.text(session, 'Enter the new name');
    } else {
      builder.Prompts.text(session, 'Enter valid name');
    }
  },
  function(session, newName) {
    if (!emailHelper.validateName(newName.response)) {
      session.send('Invalid name.');
      session.replaceDialog('/editProfile', { reprompt: true });
      return;
    }

    usersDB.findOneAndUpdate({email: session.userData.profile.email}, {name: newName.response}, (err) => {
      if (err) {
        console.error(err);
      }
    });
    session.send(`The name successfully changed, ${newName.response}!`);
    session.endDialog();
  }
]).cancelAction('cancelAction', 'Ok, canceled.', {
  matches: /^nevermind$|^cancel$/i
});
