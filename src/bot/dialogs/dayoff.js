import { bot } from '../bot.js';
import builder from 'botbuilder';
import moment from 'moment';
import { Event } from '../../models';
import mongoose from 'mongoose';

function getHolidays() {
  return new Promise(function(resolve, reject) {
    const holidays = mongoose.connection.model('Holidays');
    holidays.find({ year: 2017 }, (err, info) => {
      if (err) { 
        reject(err.reason);
      } else {
        const workedMonths = info[0] && info[0].months;
        resolve(workedMonths);
      }
    });
  });
}

function saveEvent(dayoff) {
  return new Promise(function(resolve, reject) {
    const DayOff = new Event(dayoff);
    DayOff.save((err) => {
      if (err) {
        reject(err);
      } else {
        resolve('saved...');
      }
    });			
  });
}

function getUser(userName) {
  return new Promise(function(resolve, reject) {
    const users = mongoose.connection.model('Users');
    users.findOne({ name: userName }, (err, info) => {
      if (err) {
        reject(err);
      } else {
        resolve(info);
      }
    });
  });
}

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
    };
    session.userData.dayoff = dayoff;
    saveDayoffEvent(dayoff, session.userData.profile.name);
    session.userData.time = builder.EntityRecognizer.resolveTime([startsAt]);
    var card = createHeroCard(session, reason);
    var msg = new builder.Message(session).addAttachment(card);
    session.send(msg);
    session.endDialogWithResult();
    session.beginDialog('/menu');
  }
]);

function createHeroCard(session,reason) {
  const imageUrl = 'http://2.bp.blogspot.com/-AJcBRl3gmJk/VPdRVHoEa5I/AAAAAAAAaTU/'+
  '23keCkkciQQ/s1600/keep-calm-and-have-a-day-off-3.png';
  const { startsAt, endsAt } = session.userData.dayoff;
  const diff = moment(endsAt).diff(moment(startsAt), 'days');
  const dayoffs = diff > 1 ? `${moment(startsAt).format('MMMM Do YYYY')} - ${moment(endsAt).format('MMMM Do YYYY')}`
    : moment(startsAt).format('MMMM Do YYYY');
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

const saveDayoffEvent = async (event, userName) => {
  const dayoff = event;
  const year = moment(dayoff.startsAt).year();
  const dayOffCount = moment(dayoff.endsAt).diff(moment(dayoff.startsAt), 'days');
  if(event.isVacation) {
    const workedMonths = await getHolidays(new Date());
    const user = await getUser(userName);
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
  saveEvent(dayoff);
};

export default saveDayoffEvent;
