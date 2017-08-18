import { bot } from '../bot.js';

const userOptions = 'You can: \n- day off \n- edit profile \n- info on me \n' +
  '- active events \n- day off [numberOfDays] dd.mm.yyyy [reason] \n- i am admin';
const adminOptions = 'You can: \n- day off \n- edit profile \n- info on me / email / Name \n' +
  '- my upcoming events \n- change info of {email} {property=value} (for example role=admin) \n- requests waiting for my action \n' +
  '- settings \n- events of {email} \n- add holiday on DD.MM.YYYY {name} \n' +
  '- holidays on MM.YYYY \n' +
  '- What\'s email status on dd.mm.yyyy \n' +
  '- attendance of {email} on {mm.yyyy} \n' +
  '- day off [numberOfDays] dd.mm.yyyy [reason]';

bot.dialog('/help', [
  function(session) {
    if (!session.userData.profile) session.beginDialog('/ensureProfile');
    if (session.userData.profile.role !== 'admin') {
      session.send(userOptions);
    } else{
      session.send(adminOptions);
    }
    session.endDialog();
  }
]);

