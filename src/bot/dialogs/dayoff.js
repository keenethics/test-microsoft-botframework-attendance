import { bot } from '../bot.js';
import builder from 'botbuilder';
import moment from 'moment';
import { getHolidays, saveEvent, saveEventIntoUser, getEventDate } from '../helpers/events.js';
import { getUserByEmail } from '../helpers/users.js';

require('babel-polyfill');
bot.dialog('/dayoff' , [

  function (session) {
    builder.Prompts.text(session,'how many days do you want ?');
  },

  function (session, results){
    session.userData.dayOff = { dayOffCount: parseInt(results.response,10) };
    builder.Prompts.text(session,'whats up ?');

  },
  function (session,results){
    session.userData.dayOff.reason = results.response; 
    builder.Prompts.text(session, 'What time would you like to set an day off  for? (dd.mm.yyyy)');   
  },
  function (session, results ,reason){
    const { dayOffCount } = session.userData.dayOff; 
    const dayMonth = results.response.split('.');
    const day = dayMonth[0];
    const month = dayMonth[1];
    const year = dayMonth[2];
    const date = moment({ month, date: day, year })._d;
    const startsAt = moment(date)._d;
    const endsAt = moment(startsAt).clone().add(dayOffCount, 'days')._d;
    const type = 'dayoff'; 
    const dayoff = {
      startsAt,
      endsAt,
      type,
      comment: session.userData.dayOff.reason,
      user: session.userData.profile.email,
      responses: [], 
      createdAt: new Date(),
    };
    session.userData.dayoff = dayoff;
    saveDayoffEvent(dayoff, session.userData.profile.email);
    session.userData.time = builder.EntityRecognizer.resolveTime([startsAt]);
    var card = createHeroCard(session, reason);
    var msg = new builder.Message(session).addAttachment(card);
    session.send(msg);
    session.endDialogWithResult();
    session.beginDialog('/menu');
  }
]).endConversationAction(
  'returnToMainMenu', 'Returning to main menu',
  {
    matches: /^cancel$/i
  }
);

function createHeroCard(session,reason) {
  const imageUrl = 'http://2.bp.blogspot.com/-AJcBRl3gmJk/VPdRVHoEa5I/AAAAAAAAaTU/'+
  '23keCkkciQQ/s1600/keep-calm-and-have-a-day-off-3.png';
  const dayoffs = getEventDate(session.userData.dayoff); 
  return new builder.HeroCard(session)
        .title('Day off for  %s', session.userData.profile.name)
        .text('Reason: " %s "', reason)
        .text('AT: " %s "', dayoffs)
        .images([
          builder.CardImage.create(session, imageUrl)
        ])
        .buttons([
          builder.CardAction.openUrl(session,'https://www.google.com.ua/', 'Send(to mc)')
        ]);
}

const saveDayoffEvent = async (event, email) => {
  const dayoff = event;
  const year = moment(dayoff.startsAt).year();
  const dayOffCount = moment(dayoff.endsAt).diff(moment(dayoff.startsAt), 'days');
  const user = await getUserByEmail(email);
  if(event.isVacation) {
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

export default saveDayoffEvent;
