import { bot } from '../bot.js';
import builder from 'botbuilder';
import { checkUserAvailabilityOnDate } from '../helpers/events';

bot.dialog('/userStatus', [
  function(session) {
    if (session.userData.profile.role !== 'admin') {
      session.send('This feature available only for admins');
      session.endDialog();
      return;
    }

    builder.Prompts.text(session, 'Enter query. e.g. What\'s oleksiy.pletnov@keenethics.com status on 05.05.2017?');
  },
  function(session, results) {
    const answer = results.response;

    const userEmail = answer.match(/[a-zA-z0-9_.]+@keenethics.com/g)[0];
    const date = answer.match(/[0-9]{2}\.[0-9]{2}\.[0-9]{4}/)[0];

    checkUserAvailabilityOnDate(userEmail, date).then((result) => {
      session.send(result);
    });
    session.endDialog();
    session.beginDialog('/menu');
  }
]).endConversationAction(
  'returnToMainMenu', 'Returning to main menu',
  {
    matches: /^cancel$/i
  }
);
