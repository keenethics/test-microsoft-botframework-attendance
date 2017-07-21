import { bot } from '../bot.js';
import builder from 'botbuilder';
import { validateDate } from '../helpers/date.js';
import moment from 'moment';
import { getEventsOnDate, } from '../helpers/events.js'; 
import { getMomentDDMMFormat } from '../helpers/date.js'; 

bot.dialog('/eventsOnDate', [
  async function(session, args) {
    session.send('welcome to events on dialog');
    console.log(args.matched.input);
    const query = args.matched.input;
    console.log("query ");
    console.log(query)
    console.log(query.split("events on "));
    const date = query.split('events on ').filter(d => (d))[0];
    console.log("date12345");
    console.log(date);
    const validDate = validateDate(date);
    let events = [];
    if (!validDate) {
      session.send('incorect date...');
      session.endDialog();
    } else if (validDate == 2 || validDate == 1) {
      const [startDate, endDate] = date.split('-');
      events = await getEventsOnDate(getMomentDDMMFormat(startDate), getMomentDDMMFormat(endDate)); 
      console.log('events');
      console.log(events);
    } 
    session.endDialog(); 
  }
]);
