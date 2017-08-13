import moment from 'moment';
import { bot } from '../bot.js';
import builder from 'botbuilder';
import { getUserByEmail } from '../helpers/users.js';
import { getEventsByIds, getEventDate, cancelEvent } from '../helpers/events.js';

bot.dialog('/activeEvents', [
  async function (session) {
    const user = await getUserByEmail(session.userData.profile.email);
    const events = await getEventsByIds(user.events, { startsAt: { $gt: new Date() }});
    const sortedEvents = events;
    session.dialogData.mappedEvents = {};
    sortedEvents.forEach((ev, index) => { session.dialogData.mappedEvents[index] = ev._id; });
    const displayEvents = sortedEvents.map((ev,index) => {
      let status = 'pending';
      if (ev.rejected.length > 0) {
        status = 'rejected';
      } else {
        if (ev.approved.length > 0) {
          status = 'approved';
        }
      }
      return `${index} - ${getEventDate(ev)} ${ev.type} reason: ${ev.comment}\n status: ${status}\n\n\n`;
    });
    let response = '';
    session.dialogData.displayEvents = displayEvents;
    response += 'your events: \n\n\n';
    displayEvents.forEach(ev => {
      response += ev;
    });
    response += '\n\n\nto cancel event type "cancel {number}"';
    response += 'type "menu" to go to the main menu';
    builder.Prompts.text(session, response);
  },

  async function (session,results){
    const { mappedEvents, displayEvents } = session.dialogData;
    const action = results.response; 
    const expMenu = /^menu$/;
    const exp = /^cancel [0-9]+/;
    const number = action.replace( /^\D+/g, '');
    const dialogId = mappedEvents[number];
    if (expMenu.test(action)) {
      session.endDialog();
      session.beginDialog('/help');
      session.beginDialog('/menu');   
    } else if (exp.test(action)){ 
      const success = await cancelEvent(dialogId);
      if (success) {
        session.send(`event ${displayEvents[number]} has been canceled`);
      } else {
        session.send('ops... something wrong');
      }
    } else {
      session.endDialog();
      session.beginDialog('/help');
      session.beginDialog('/menu');
    }
  },
]).cancelAction('cancelAction', 'Ok, canceled.', {
  matches: /^nevermind$|^cancel$/i
});


bot.dialog('/rejected', [
  async function (session) {
    const user = await getUserByEmail(session.userData.profile.email);
    const events = await getEventsByIds(user.events, { startsAt: { $gt: new Date() },
      'rejected.0' : { $exists: true }});
    events.forEach((ev,index) => {
      session.send(`${index} - ${getEventDate(ev)} ${ev.type} reason: ${ev.comment}`);   
    });
    session.send('rejected events');
    builder.Prompts.text(session, '1.menu 2. active events');
  },
  function (session, results) {
    switch (results.response) {
      case 'menu': 
        session.beginDialog('/menu');
        break;
      case 'active events': 
        session.beginDialog('/activeEvents');
        break;
      default:
        session.beginDialog('/rejected');
        break;
    }
  }
]).cancelAction('cancelAction', 'Ok, canceled.', {
  matches: /^nevermind$|^cancel$/i
});


bot.dialog('/approved', [
  async function (session) {
    const user = await getUserByEmail(session.userData.profile.email);
    const today = moment()._d;
    const pastDate = moment(today).clone().subtract(2, 'd')._d;
    const events = await getEventsByIds(user.events, { createdAt: { $lt: pastDate }});
    events.forEach((ev,index) => {
      session.send(`${index} - ${getEventDate(ev)} ${ev.type} reason: ${ev.comment}`);   
    });
    session.send('rejected events');
    builder.Prompts.text(session, '1.menu 2. active events');
  },
  function (session, results) {
    switch (results.response) {
      case 'menu': 
        session.beginDialog('/menu');
        break;
      case 'active events': 
        session.beginDialog('/activeEvents');
        break;
      default:
        session.beginDialog('/approved');
        break;
    }
  }
]).cancelAction('cancelAction', 'Ok, canceled.', {
  matches: /^nevermind$|^cancel$/i
});

