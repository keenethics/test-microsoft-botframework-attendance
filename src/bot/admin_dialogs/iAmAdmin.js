import { bot } from '../bot.js';
import builder from 'botbuilder';
import { getUserByEmail } from '../helpers/users.js';

bot.dialog('/iAmAdmin', [
  function (session) {
    builder.Prompts.text(session,'whats your email?');
  },
  async function(session, results) {
    const res = results.response; 
    const emailReg = /(([^<>()\[\]\\.,;:\s@"]+(\.[^<>()\[\]\\.,;:\s@"]+)*)|(".+"))@((\[[0-9]{1,3}\.[0-9]{1,3}\.[0-9]{1,3}\.[0-9]{1,3}])|(([a-zA-Z\-0-9]+\.)+[a-zA-Z]{2,}))/;
    const email = res.match(emailReg);
    const user = await getUserByEmail(email);
    if (user.role === 'admin') {
      if (!session.userData.profile) session.userData.profile = {};
      session.userData.profile.role = 'admin';
      session.send('you are admin');
    } else {
      session.send('you are not admin');
    }
    session.endDialog();
  }
]).cancelAction('cancelAction', 'Ok, canceled.', {
  matches: /^nevermind$|^cancel$/i
});
