import { bot } from '../bot.js';

const userOptions = 'You can: - day off - edit profile - info on me - vacation - active events';
const adminOptions = 'You can: - day off - edit profile - info on me / email / Name - vacation - ' +
  'active events - change info - confirm events - settings - events on - What\'s email status on dd.mm.yyyy';

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
