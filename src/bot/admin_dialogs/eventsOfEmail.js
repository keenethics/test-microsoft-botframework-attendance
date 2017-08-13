import { bot } from '../bot.js';
import { getEventDate, getUpcomingEventsByEmail } from '../helpers/events.js'; 
import { emailReg } from '../dialogs/dialogExpressions.js';

bot.dialog('/eventsOfEmail', [
  async function(session, args) {
    const query = args.matched.input;
    const queryString = query.replace(/events of /, '');
    const matchedEmail = queryString.match(emailReg);
    const email = matchedEmail && matchedEmail[0];
    if (!email) {
      session.send('incorrect email');
      session.endDialog();
      session.beginDialog('/help');
      session.beginDialog('/menu');
      return;
    }
    let msg = `events of ${email}: \n\n`;
    let events = await getUpcomingEventsByEmail(email); 
    events.forEach((ev,index) => {
      let status = 'pending';
      if (ev.rejected.length > 0) { 
        status = 'rejected';
      } else {
        if (ev.approved.length > 0) {
          status = 'approved';
        }
      }
      msg += `${index} - ${getEventDate(ev)} ${ev.type} reason: ${ev.comment} user: ${ev.user} status: ${status} \n\n`;
    }); 
    if (!events.length) {
      msg = `there is not any events requested by ${email}`;
    }
    session.send(msg);
    session.endDialog(); 
  },
]).cancelAction('cancelAction', 'Ok, canceled.', {
  matches: /^nevermind$|^cancel$/i
});

