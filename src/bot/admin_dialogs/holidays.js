import { bot } from '../bot.js';
import { validateDate, formatDate } from '../helpers/date.js';
import { addHoliday, getHolidays, removeHoliday } from '../helpers/holidays.js';
import builder from 'botbuilder';
import { getMomentDDMMFormat } from '../helpers/date.js';
import moment from 'moment';
bot.dialog('/holidays', [
  async function(session, args) {
    const query = args.matched.input;
    const queryString = query.replace(/holidays on /, '');
    const dateExp = /^([0][0-9]|[1][0-2])[.][0-9]{4}$/;
    if (!dateExp.test(queryString)) { 
      session.send('incorrect month or year');
    }
    const dM = queryString.split('.')
    const month = dM[0]; 
    const year = dM[1];
    const holidays = await getHolidays({ year, month }); 
    let msg = 'to remove holidays type \" remove {number} \"'
    let holidaysMsg = '';
    if (!holidays.length) {
      msg = 'there is not any holidays';
    }
    session.dialogData.mathcIdInNumber = {};
    const mathcIdInNumber = holidays.forEach((h,i) => {
      holidaysMsg += `${i}: ${h.name} - ${formatDate(h.date)} \n\n\n\n`
      session.dialogData.mathcIdInNumber[i] = h._id; 
    });
    builder.Prompts.text(session, holidaysMsg + msg);
  },

  async function(session,results) {
    const res  = results.response; 
    const resExp = /^remove [0-9]{1,3}$/; 
    if (!resExp.test(res)) {
      session.send('incorect input');
      session.endDialog();
    }
    const ind = parseInt(res.replace('remove ','')) 
    let op = null;
    if (ind) {
      const holidayId = session.dialogData.mathcIdInNumber[ind]; 
      op = await removeHoliday(holidayId);
    }
    if (!op) {
      session.send('something went wrong');
    } else {
      session.send('holiday has been removed');
    }
    session.endDialog();
    
  }

]).cancelAction('cancelAction', 'Ok, canceled.', {
  matches: /^nevermind$|^cancel$/i
});

bot.dialog('/addHoliday', [
  async function(session, args) {
    if (session.userData.profile.role !== 'admin') {
      session.send('This feature available only for admins');
      session.endDialog();
      return;
    }
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
