import builder from 'botbuilder';
import moment from 'moment';
import { bot } from '../bot.js';
import {
  getHolidays,
  saveEvent,
  saveEventIntoUser,
  getEventDate
} from '../helpers/events.js';
import { getUserByEmail } from '../helpers/users.js';

bot.dialog('/dayoffShortCommand' , [
  function (session, results){
    session.userData.dayOff = {
      dayOffCount: parseInt(results.matched.input.match(/[1-9][0-9]?/)[0], 10)
    };

    const goodDate = /(0[1-9]|[12][0-9]|3[01])[- /.](0[1-9]|1[012])[- /.](19|20)\d\d/;
    const dateString = results.matched.input.match(goodDate)[0];

    const { dayOffCount } = session.userData.dayOff;
    const dayMonth = dateString.split('.');
    const day = dayMonth[0];
    const month = dayMonth[1];
    const year = dayMonth[2];
    const date = moment({ month, date: day, year })._d;
    const startsAt = moment(date)._d;
    const endsAt = moment(startsAt).clone().add(dayOffCount, 'days')._d;
    const type = 'dayoff';

    session.userData.dayOff.reason = results.matched.input.slice(results.matched.input.search(goodDate) + 10).trim();

    session.userData.dayoff = {
      startsAt,
      endsAt,
      type,
      comment: session.userData.dayOff.reason,
      user: session.userData.profile.email,
      responses: [],
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
    session.beginDialog('/menu');
  }
]).cancelAction('cancelAction', 'Ok, canceled.', {
  matches: /^nevermind$|^cancel$/i
});

const saveDayoffEvent = async (event, email) => {
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
    saveEventIntoUser(user._id, eventId);
  }
};
