import { bot } from '../bot.js';
import builder from 'botbuilder';
import { getUserByEmail } from '../helpers/users.js';
import { getPendingEvents, getEventDate, approveOrRejectEvent  } from '../helpers/events.js';

bot.dialog('/requestsWaiting', [
  async function(session) {
    if (session.userData.profile.role !== 'admin') {
      session.send('This feature available only for admins');
      session.endDialog();
      return;
    }
    const user = await getUserByEmail(session.userData.profile.email);
    session.dialogData.adminId = user && user._id;
    const events = await getPendingEvents(user._id);
    session.dialogData.mappedEvents = {};
    events.forEach((ev, index) => { session.dialogData.mappedEvents[index] = ev._id; });
    let msg = '';
    events.forEach((ev,index) => {
      msg += `${index} - ${getEventDate(ev)} ${ev.type} reason: ${ev.comment} user: ${ev.user} \n\n`;
    }); 
    msg += 'to reject/approve event type "reject/approve {number}"\n\n';
    msg += 'type "menu" to go to the main menu';
    builder.Prompts.text(session, msg);
  },
  
  async function (session, result) {
    const action = result.response;
    const { adminId } = session.dialogData;
    const { mappedEvents } = session.dialogData;
    const expMenu = /^menu$/;
    const rejectExp = /^reject [0-9]+/;
    const approveExp = /^approve [0-9]+/;
    const number = action.replace( /^\D+/g, '');
    const eventId = mappedEvents[number];
    if (expMenu.test(action)) {
      session.endDialog();
      session.beginDialog('/menu');   
      return;
    } 

    const approve =  approveExp.test(action);
    const reject = rejectExp.test(action);
    let confirmEvent;
    if (approve) confirmEvent = 'approved';
    if (reject) confirmEvent = 'rejected';
    if (!confirmEvent) {
      session.endDialog();
      session.beginDialog('/menu');   
      return;       
    }
    const success = await approveOrRejectEvent(eventId, adminId, confirmEvent);
    let msg = '';
    if (success) {
      msg = `event ${mappedEvents[number]} has been ${confirmEvent}`;
    } else {
      msg = 'ops... something wrong';
    }
    session.send(msg);
    session.endDialog();
    session.beginDialog('/menu');
  }
]).cancelAction('cancelAction', 'Ok, canceled.', {
  matches: /^nevermind$|^cancel$/i
});

