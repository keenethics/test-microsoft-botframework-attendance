import { bot } from '../bot.js';
import builder from 'botbuilder';
import { getUserByEmail } from '../helpers/users.js';
import { getPendingEvents, getEventDate, approveOrRejectEvent  } from '../helpers/events.js';

bot.dialog('/events', [
  function(session) {
    if (session.userData.profile.role != 'admin') {
      session.send('This feature available only for admins');
      session.endDialog();
      return;
    }
  },
  async function(session, result) {  
    const user = await getUserByEmail(session.userData.profile.email);
    session.dialogData.adminId = user && user._id;
    const events = await getPendingEvents(user._id);
    session.dialogData.mappedEvents = {};
    events.forEach((ev, index) => { session.dialogData.mappedEvents[index] = ev._id; });
    const displayEvents = events.map((ev,index) => (
      `${index} - ${getEventDate(ev)} ${ev.type} reason: ${ev.comment} user: ${ev.user}`
    )); 
    displayEvents.forEach(ev => {
      session.send(ev);
    });
    session.send('to reject/ event type "reject/event {number}"');
    session.send('type "menu" to go to the main menu');
    builder.Prompts.text(session,' ?');
  },
  
  function (session, result) {
    const action = result.response;
    const { adminId } = session.dialogData;
    const { mappedEvents } = session.dialogData;
    const expMenu = /^menu$/;
    const rejectExp = /^reject [0-9]+/;
    const approveExp = /^approve [0-9]+/;
    const number = action.replace( /^\D+/g, '');
    const eventId = mappedEvents[number];
    if (expMenu.test(action)) {
      session.beginDialog('/menu');   
    } 

    const approve =  approveExp.test(action);
    const reject = rejectExp.test(action);
    const confirmEvent = approve ? 'approved' : 'rejected';
    const success = approveOrRejectEvent(eventId, adminId, confirmEvent);
    if (success) {
      session.send(`event ${mappedEvents[number]} has been ${reject ? 'rejected' : 'approved' }`);
    } else {
      session.send('ops... something wrong');
    }
    session.send('type "menu" to go to the main menu');   
    builder.Prompts.text(session,' ?');
  },

  function (session, result) {
    switch (result.response) {
      case 'menu': 
        session.beginDialog('/menu');
        break;
      default:
        session.beginDialog('/rejected');
        break;
    }
  }
]);
