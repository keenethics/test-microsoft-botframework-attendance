import moment from 'moment';
import { bot } from '../bot.js';
import builder from 'botbuilder';
import { getUserByEmail } from '../helpers/users.js';
import { getEventsByIds, getEventDate, cancelEvent } from '../helpers/events.js';

bot.dialog('/pending', [
  async function (session) {
    session.send(`your events ${session.userData.profile.email} `);
    const user = await getUserByEmail(session.userData.profile.email);
    const events = await getEventsByIds(user.events, { startsAt: { $gt: new Date() },
      rejected: { $size: 0 }});
    const sortedEvents = events;
    session.dialogData.mappedEvents = {};
    sortedEvents.forEach((ev, index) => { session.dialogData.mappedEvents[index] = ev._id; });
    const displayEvents = sortedEvents.map((ev,index) => (
      `${index} - ${getEventDate(ev)} ${ev.type} reason: ${ev.comment}`   
    ));
    session.dialogData.displayEvents = displayEvents;
    session.send(`your events ${session.userData.profile.email} `);
    displayEvents.forEach(ev => {
      session.send(ev);
    });
    session.send('to cancel event type "cancel {number}"');
    session.send('type "menu" to go to the main menu');
    builder.Prompts.text(session,' ?');
  },
  function (session,results){
    const { mappedEvents, displayEvents } = session.dialogData;
    const action = results.response; 
    const expMenu = /^menu$/;
    const exp = /^cancel [0-9]+/;
    const number = action.replace( /^\D+/g, '');
    const dialogId = mappedEvents[number];
    if (expMenu.test(action)) {
      session.beginDialog('/menu');   
    } else if (exp.test(action)){ 
      const success = cancelEvent(dialogId);
      if (success) {
        session.send(`event ${displayEvents[number]} has been canceled`);
      } else {
        session.send('ops... something wrong');
      }
    } else {
      session.send('type correct query');
      session.beginDialog('/activeEvents');
    }
  },

]);


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
]);


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
]);


bot.dialog('/activeEvents', [
  function (session){
    const options = ['pending', 'rejected', 'approved', 'menu'];
    session.dialogData.options = options;
    builder.Prompts.text(session, '1.pending 2.rejected 3.approved 4.menu');
  },
  function (session, results) {
    const dialog = results.response;
    if (session.dialogData.options.indexOf(dialog) > -1) {
      session.beginDialog(`/${dialog}`);
    } else {
      session.send('what do you mean ?');
      session.beginDialog('/activeEvents');
    }
  }
]);
