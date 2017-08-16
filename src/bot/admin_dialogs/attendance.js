import { bot } from '../bot.js';
import { formatDate } from '../helpers/date.js';
import { getDayOffsOnMonth } from '../helpers/events.js';
import moment from 'moment';
import business from 'moment-business';
import { emailReg } from '../dialogs/dialogExpressions.js';

bot.dialog('/attendance', [
  async function(session, args) {
    if (session.userData.profile.role !== 'admin') {
      session.send('This feature available only for admins');
      session.endDialog();
      return;
    }
    const query = args.matched.input;
    const queryString = query.replace(/attendance of /, '');
    const att = queryString.split(' on ');
    let email, date;
    const matchedEmail = att[0].match(emailReg);
    email = matchedEmail && matchedEmail[0];
    date = att[1];
    const mmYYYY = date.split('.');
    const dayoffs = await getDayOffsOnMonth(email, date); 
    const startDate = moment({ month: mmYYYY[0], year: mmYYYY[1], day: 1 });
    const endDate = moment(startDate).clone().add('month', 1).date(0);
    const weekendDays = business.weekendDays(startDate, endDate);

    const daysInMonth = moment({month: mmYYYY[0], year: mmYYYY[1]}).daysInMonth();
    const dayOffsCount = dayoffs
      .map(d => (moment(d.endsAt).diff(moment(d.startsAt), 'days')))
      .reduce((da, db) => (da + db), 0);
    let dayOffsMsg = 'days off' + '\n\n' + dayoffs
      .map(d =>  (`${formatDate(d.startsAt)} - ${formatDate(d.endsAt)}`)).join('\n\n');
    const attendance = (daysInMonth - weekendDays - dayOffsCount) / daysInMonth;
    dayOffsMsg += `\n\n attendance: ${attendance} \n\n`;
    session.send(dayOffsMsg);
    session.endDialog();
  }]);

