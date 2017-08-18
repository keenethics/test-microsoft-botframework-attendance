import builder from 'botbuilder';
import moment from 'moment';
import { bot } from '../bot.js';
import { notifyAdmins } from '../helpers/notifications.js';

import {
  getHolidays,
  saveEvent,
  saveEventIntoUser,
  getEventDate
} from '../helpers/events.js';
import { getUserByEmail } from '../helpers/users.js';

bot.dialog('/dayoff' , [

  function (session) {
    builder.Prompts.text(session, 'how many days do you want ?');
  },

  function (session, results){
    session.userData.dayOff = { dayOffCount: parseInt(results.response,10) };
    builder.Prompts.text(session, 'whats up ?');
  },

  function (session, results){
    session.userData.dayOff.reason = results.response; 
    builder.Prompts.text(session, 'What time would you like to set an day off for? (dd.mm.yyyy)');
  },

  async function (session, results){
    const { dayOffCount } = session.userData.dayOff; 
    const dayMonth = results.response.split('.');
    const day = dayMonth[0];
    const momentMonth = parseInt(dayMonth[1], 10); 
    const month = momentMonth - 1;
    const year = dayMonth[2];
    const date = moment({ month, date: day, year })._d;
    const startsAt = moment(date)._d;
    const endsAt = moment(startsAt).clone().add(dayOffCount, 'days')._d;
    const type = 'dayoff';
    session.userData.dayoff = {
      startsAt,
      endsAt,
      type,
      comment: session.userData.dayOff.reason,
      user: session.userData.profile.email,
      rejected: [],
      approved: [],
      createdAt: new Date(),
    };
    session.userData.time = builder.EntityRecognizer.resolveTime([startsAt]);
    const dayoffs = getEventDate(session.userData.dayoff);

    session.send(`Day off for ${session.userData.profile.name}\n
    Reason: ${session.userData.dayOff.reason}\n
    AT: ${dayoffs}`);

    builder.Prompts.text(session, 'Send "yes" to save the request');
  },
  function (session, results) {
    if (/^yes/i.test(results.response)) {
      saveDayoffEvent(session.userData.dayoff, session.userData.profile.email);
      session.send('Saved');
    } else {
      session.send('Canceled');
    }
    session.endDialogWithResult();
    session.beginDialog('/help');
    session.beginDialog('/menu');
  }
]).cancelAction('cancelAction', 'Ok, canceled.', {
  matches: /^nevermind$|^cancel$/i
});

const saveDayoffEvent = async (event, email) => {
  return new Promise(async function(resolve, reject) {
    const dayoff = event;
    const year = moment(dayoff.startsAt).year();
    const dayOffCount = moment(dayoff.endsAt).diff(moment(dayoff.startsAt), 'days');
    const user = await getUserByEmail(email);
    if (event.isVacation) {
      const workedMonths = await getHolidays(new Date());
      const workedMonthsObject = {};
      workedMonths.forEach(wM => workedMonthsObject[wM.month] = wM.totalWorkingDays);
      const actuallyWorked = user.workingInfo.filter(wI => (wI.year === parseInt(year, 10)))[0];
      const actuallyWorkedObject =  {};
      actuallyWorked.months.forEach(aW => actuallyWorkedObject[aW.month] = aW.actuallyWorkedDays);
      let vacations = 0;
      for (let keys in actuallyWorkedObject) {
        vacations += (actuallyWorkedObject[keys] / workedMonthsObject[keys]) * 1.66;
      }
      const { usedVacations } = user;
      dayoff.vacationsUsed = Math.floor(vacations) - usedVacations - dayOffCount;
      dayoff.daysOffUsed = 0;
    } else {
      dayoff.vacationsUsed = 0;
      dayoff.daysOffUsed = dayOffCount;
    }
    const eventId = await saveEvent(dayoff);
    if (eventId) {
      const savedIntoUser = await saveEventIntoUser(user._id, eventId);
      const adminNotified = await notifyAdmins(eventId);
      if (savedIntoUser && adminNotified) resolve('saved');
    }
    reject('error while saving day off');
  });
};

export default saveDayoffEvent;
