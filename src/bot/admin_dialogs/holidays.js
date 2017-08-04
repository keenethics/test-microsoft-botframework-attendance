import { bot } from '../bot.js';
import { validateDate } from '../helpers/date.js';
import { addHoliday } from '../helpers/holidays.js';
import builder from 'botbuilder';
import { getMomentDDMMFormat } from '../helpers/date.js';
import moment from 'moment';
bot.dialog('/holidays', [
  async function(session, args) {
  }
]).cancelAction('cancelAction', 'Ok, canceled.', {
  matches: /^nevermind$|^cancel$/i
});

bot.dialog('/addHoliday', [
  async function(session, args) {
    const query = args.matched.input;
    const queryString = query.replace(/add holiday on /, '');
    const dateExp = /[0-9]{2}.[0-9]{2}.[0-9]{4}/;
    const date = getMomentDDMMFormat(queryString.match(dateExp)[0]);
    const name = queryString.replace(dateExp, '').trim();
    const result = await addHoliday({date, name}); 
    let msg = result;
    if (typeof result !== 'string') msg = `holiday ${name} on ${moment(date).format('MMMM Do YYYY')} has been created`
    session.send(msg);
    session.endDialog();
  }
]).cancelAction('cancelAction', 'Ok, canceled.', {
  matches: /^nevermind$|^cancel$/i
});
