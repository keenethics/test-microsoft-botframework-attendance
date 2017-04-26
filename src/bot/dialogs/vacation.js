import { bot } from '../bot.js';
import builder from 'botbuilder';
import moment from 'moment';
import saveDayoffEvent from './dayoff';

bot.dialog('/vacation' , [
  function (session) {
    builder.Prompts.text(session,'how many vocation days do you want ?');
  },

  function (session,results){
    session.userData.vacationCount = parseInt(results.response, 10); 
    builder.Prompts.text(session, 'What date do you want to start your vocation ? (dd.mm.yyyy)');   
  },

  function (session, results, next){
    const { vacationCount } = session.userData; 
    const dayMonth = results.response.split('.');
    const day = dayMonth[0];
    const month = dayMonth[1];
    const year = dayMonth[2];
    const date = moment({ month, date: day, year })._d;
    const startsAt = moment(date)._d;
    const endsAt = moment(startsAt).clone().add(vacationCount, 'days')._d;
    const type = 'dayoff'; 
    const dayoff = {
      isVacation: true,
      startsAt,
      endsAt,
      type,
      comment: 'vocation',
      user: session.userData.profile.name,
      responses: [], 
    };
    session.userData.dayoff = dayoff;
    saveDayoffEvent(dayoff, session.userData.profile.name);
    next();
  },
  function (session) {
    const { dayoff } = session.userData;
    const startsAt = moment(dayoff.startsAt).format('MMMM Do YYYY');
    const endsAt = moment(dayoff.endsAt).format('MMMM Do YYYY');
    session.send(`request for vocation for ${startsAt}-${endsAt} has been sent`);
    session.endDialog();
    session.beginDialog('/menu');
  },
]);
