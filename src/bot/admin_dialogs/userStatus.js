import { bot } from '../bot.js';
import { checkUserAvailabilityOnDate } from '../helpers/events';

bot.dialog('/userStatus', [
  function(session, result) {
    if (session.userData.profile.role !== 'admin') {
      session.send('This feature available only for admins');
      session.endDialog();
      return;
    }

    const answer = result.matched.input;
    const userEmail = answer.match(/[a-zA-z0-9_.]+@keenethics.com/g)[0];
    const date = answer.match(/[0-9]{2}\.[0-9]{2}\.[0-9]{4}/)[0];

    checkUserAvailabilityOnDate(userEmail, date).then((result) => {
      session.send(result);
    });
    session.endDialog();
    session.beginDialog('/menu');
  },
]);
