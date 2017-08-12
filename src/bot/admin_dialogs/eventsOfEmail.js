import { bot } from '../bot.js';
import { getEventDate, getUpcomingEventsByEmail } from '../helpers/events.js'; 

bot.dialog('/eventsOfEmail', [
  async function(session, args) {
    session.send('welcome to events on dialog');
    const query = args.matched.input;
    const queryString = query.replace(/events of /, '');
    const email = queryString;
    let events = await getUpcomingEventsByEmail(email); 
    let msg = '';
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

