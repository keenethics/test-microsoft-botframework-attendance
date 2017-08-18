import { bot } from '../bot.js';
import builder from 'botbuilder';
import { getUserByEmail } from '../helpers/users.js';
import { emailReg } from '../dialogs/dialogExpressions.js';
bot.dialog('/iAmAdmin', [
  function (session) {
    builder.Prompts.text(session,'whats your email?');
  },
  async function(session, results) {
    const res = results.response; 
    const emailMatch = res.match(emailReg);
    const email = emailMatch && emailMatch[0];
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
