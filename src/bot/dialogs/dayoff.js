import { bot } from '../bot.js';
import builder from 'botbuilder';
import moment from 'moment';
import { Event } from '../../models';
import Fiber from 'fibers';
import mongoose from 'mongoose';

var sendEmailAboutNewEvent = require('../../email_notifications/EventsNotification').sendEmailAboutNewEvent;
var setSessionAddressForUser = require('../../models/db/methods/usersMethods').setSessionAddressForUser;
let data = {};
let workedMonths = [];
let user = {};

function getHolidays() {
  const holidays = mongoose.connection.model('Holidays');
  const fiber = Fiber.current;
  holidays.find({ year: 2017 }, (err, info) => {
    workedMonths = info[0] && info[0].months;
    fiber.run();
  });
  Fiber.yield();
}

function saveEvent(dayoff) {
  const DayOff = new Event(dayoff);
  DayOff.save((err, result) => {
    if (err) { console.error(err); }
    data = result;
    console.info('saved......');
  });	
}

function getUser(userName) {
  const users = mongoose.connection.model('Users');
  const fiber = Fiber.current;
  users.findOne({ name: userName }, (err, info) => {
    user = info;
    fiber.run();
  });
  Fiber.yield();
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
      user: session.userData.profile.name,
      responses: [], 
    };
    session.userData.dayoff = dayoff;
    saveDayoffEvent(dayoff, session.userData.profile.name);
    setSessionAddressForUser(session.userData.profile.name, session.message.address);
    session.userData.time = builder.EntityRecognizer.resolveTime([startsAt]);
    var card = createHeroCard(session, reason);
    var msg = new builder.Message(session).addAttachment(card);
    session.send(msg);
    session.endDialogWithResult();
    session.beginDialog('/menu');
  }
]);


bot.dialog('/sendEmail', [
  function(session) {
    sendEmailAboutNewEvent(data, function(answer) {
      session.endDialog(answer);
    });
  }
]);
bot.beginDialogAction('sendEmail', '/sendEmail');


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
          builder.CardAction.dialogAction(session, 'sendEmail','' ,'Send(to mc)')
        ]);
}



function saveDayoffEvent (event, userName) {
  const dayoff = event;
  const year = moment(dayoff.startsAt).year();
  const dayOffCount = moment(dayoff.endsAt).diff(moment(dayoff.startsAt), 'days');

  Fiber(function() {
    if(event.isVacation) {
      if (!workedMonths.length) getHolidays(new Date());
      getUser(userName);
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
  }).run();

}

export default saveDayoffEvent;
