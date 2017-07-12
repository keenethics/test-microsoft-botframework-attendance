import { bot } from '../bot.js';
import builder from 'botbuilder';
import { getUserByEmail } from '../helpers/users.js';
import { getEventsByIds, getEventDate, cancelEvent } from '../helpers/events.js';

bot.dialog('/activeEvents', [
  async function (session) {
    session.send(`your events ${session.userData.profile.email} `);
    const user = await getUserByEmail(session.userData.profile.email);
    const events = await getEventsByIds(user.events);
    const sortedEvents = events.sort((ev, ev2) => (ev2.startsAt > ev.startsAt));
    session.dialogData.mappedEvents = {};
    const mappedEvents = sortedEvents.forEach((ev, index) => { session.dialogData.mappedEvents[index] = ev._id });
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
          console.log('success');
        } else {
          session.send('ops... something wrong');
        }
    } else {
      session.send('type correct query');
      session.beginDialog('/activeEvents');
    }
  },

]);
