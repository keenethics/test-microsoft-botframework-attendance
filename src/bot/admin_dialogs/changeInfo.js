import { bot } from '../bot.js';
import { getUserByEmail, updateUser } from '../helpers/users.js';
import { emailReg } from '../dialogs/dialogExpressions.js';

bot.dialog('/changeInfo', [
  async function(session, result) {
    if (!session.userData.profile) {
      session.userData.profile = {};
    }
    if (session.userData.profile.role !== 'admin') {
      session.send('This feature available only for admins');
      session.endDialog();
      return;
    }
    const propExp = /\w{2,25}=[\w@.]{2,25}/g;
    const res = result.matched.input;
    const emailMatch = res.match(emailReg);
    const email = emailMatch && emailMatch[0];
    const changedProps = res.match(propExp);
    const setQuery = {};

    setQuery.email = email;

    changedProps.forEach(chPr => {
      const spl = chPr.split('='); 
      setQuery[spl[0]] = spl[1];
    }); 

    const user = await getUserByEmail(email);
    if (!user) {
      session.send('user not found');
      session.endDialog();
      session.beginDialog('/help');
      return;
    }
    
    const updateRes = await updateUser(setQuery);
    if (updateRes) { 
      session.send('changed');
    } else {
      session.send('something went wrong');
    }
 
    session.endDialog();
    session.beginDialog('/help');
    return;   

  }
]).cancelAction('cancelAction', 'Ok, canceled.', {
  matches: /^nevermind$|^cancel$/i
});
