import { bot } from '../bot.js';
import { getUserByEmail, updateUser } from '../helpers/users.js';
import { emailReg } from '../dialogs/dialogExpressions.js';
import { getMomentDDMMFormat } from '../helpers/date.js'; 
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
    const fieldsNotUpdated = [];
    const dateExp = /(30|31|[0-2][0-9])[.]([0][0-9]|[1][0-2])[.][0-9]{4}/;
    const dateMatch =  res.match(dateExp);
    const startWorkingDay = dateMatch && dateMatch[0] && getMomentDDMMFormat(dateMatch[0]);
    if (startWorkingDay) {
      setQuery.startWorkingDay = startWorkingDay;
    }
    changedProps.forEach(chPr => {
      const spl = chPr.split('='); 
      if (spl[1].length > 2 && spl[0] !== 'startWorkingDay') {
        setQuery[spl[0]] = spl[1];
      } else {
        if (spl[0]!== 'startWorkingDay') { fieldsNotUpdated.push(spl[0]); }
      }
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
      let msg = 'changed';
      if (fieldsNotUpdated.length) {
        msg += `fields not updated:\n\n ${fieldsNotUpdated.map(f=> (f)).join(',\n')}`; 
      } 
      session.send(msg);
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
