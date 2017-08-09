import { bot } from '../bot.js';

const userOptions = 'Available options: \n- day off \n- edit profile \n- info on me \n- vacation \n' +
  '- active events \n' + 'i am admin \n';
const adminOptions = 'You can: \n- day off \n- edit profile \n- info on me / email / Name \n' +
  '- vacation \n- active events \n- change info \n- confirm events \n- settings \n- events on \n' +
  '- add holiday on DD.MM.YYYY {name} \n' +
  '- holidays on MM.YYYY \n' +
  '- What\'s email status on dd.mm.yyyy';

bot.dialog('/help', [
  function(session) {
    if (session.userData.profile.role !== 'admin') {
      session.send(userOptions);
    } else{
      session.send(adminOptions);
    }
    session.endDialog();
  }
]);

