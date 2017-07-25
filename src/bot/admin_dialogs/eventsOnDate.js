import { bot } from '../bot.js';
import { validateDate } from '../helpers/date.js';
import { getEventsOnDate, getEventDate, approveOrRejectEvent } from '../helpers/events.js'; 
import { getUserByEmail } from '../helpers/users.js'; 
import { getMomentDDMMFormat } from '../helpers/date.js'; 
import { ofEmail } from '../dialogs/dialogExpressions.js';
import builder from 'botbuilder';

bot.dialog('/eventsOnDate', [
  async function(session, args) {
    const statusExp = /(rejected |approved |pending )/;
    session.send('welcome to events on dialog');
    const query = args.matched.input;
    const statusSpecified = query.match(statusExp) && query.match(statusExp)[0].trim();
    const queryString = query.replace(/(rejected |approved |pending )*events on /, '');
    const emailSpecified = ofEmail.test(queryString);
    let date = queryString;
    let email = '';
    if (emailSpecified) {
      const dateAndEmail = queryString.split(' of '); 
      date = dateAndEmail[0];
      email = dateAndEmail[1];
    }
    let events = [];
    const validDate = validateDate(date);
    if (!validDate) {
      session.send('incorect date...');
      session.endDialog();
    } else if (validDate == 2 || validDate == 1) {
      const [startDate, endDate] = date.split('-');
      events = (await getEventsOnDate(getMomentDDMMFormat(startDate), getMomentDDMMFormat(endDate), email, statusSpecified))
        .sort((a,b) =>(a > b));
      session.dialogData.mappedEvents = {};
      const displayEvents = events.map((ev,index) => (
        `${index} - ${getEventDate(ev)} ${ev.type} reason: ${ev.comment} user: ${ev.user}`
      ));
      displayEvents.forEach(ev => {
        session.send(ev);
      });
    } 
    if (statusSpecified === 'pending') {
      session.dialogData.statusSpecified = statusSpecified;
      events.forEach((ev, index) => { session.dialogData.mappedEvents[index] = ev._id; });
        builder.Prompts.text(session, 'you can approve or reject event by typing "approve/reject {n}'); 
    } else {
      session.endDialog();
    }
    session.send('type "menu" to go back');
  },
  async function(session, results) {
    const { mappedEvents } = session.dialogData;
    const action = results.response;
    if (action == 'menu') session.beginDialog('/menu');
    if ( session.dialogData.statusSpecified === 'pending') { 
      const queryExp = /(reject |approve )*[0-9]{1,3}/;
      if (!queryExp.test(action)) {
        session.send("incorrect input");
      } else {
        const actionExp = /(reject |approve )/
        const toDo = action.match(actionExp) && action.match(actionExp)[0].trim();
        const index = parseInt(action.replace(actionExp, ''), 10);
        const eventId = mappedEvents[index];
        const user = await getUserByEmail(session.userData.profile.email);
        const success = approveOrRejectEvent(eventId, user._id, `${toDo}d`);
        if (success) {
          session.send(`event ${mappedEvents[index]} has been ${toDo}d`);
        } else {
          session.send('ops... something wrong');
        }
      }
    }
    session.endDialog();
    session.beginDialog('/menu');
  }
]);
