import { bot } from '../bot.js';
import { validateDate } from '../helpers/date.js';
import { getEventsOnDate, } from '../helpers/events.js'; 
import { getMomentDDMMFormat } from '../helpers/date.js'; 

bot.dialog('/eventsOnDate', [
  async function(session, args) {
    session.send('welcome to events on dialog');
    const query = args.matched.input;
    const date = query.split('events on ').filter(d => (d))[0];
    const validDate = validateDate(date);
    if (!validDate) {
      session.send('incorect date...');
      session.endDialog();
    } else if (validDate == 2 || validDate == 1) {
      const [startDate, endDate] = date.split('-');
      const events = await getEventsOnDate(getMomentDDMMFormat(startDate), getMomentDDMMFormat(endDate)); 
    } 
    session.endDialog(); 
  }
]);
