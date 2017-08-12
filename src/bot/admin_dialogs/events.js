import { bot } from '../bot.js';
import builder from 'botbuilder';
import { getUserByEmail } from '../helpers/users.js';
import { getEventDate, approveOrRejectEvent  } from '../helpers/events.js';

bot.dialog('/approveEvent', [
  async function(session, args) {
    const ev = args.event;
    session.dialogData.event = ev;
    if (!ev) return;
    const evText= `${getEventDate(ev)} ${ev.type} reason: ${ev.comment} user: ${ev.user} \n\n\n`;
    const optionMsg = 'to reject/approve event type "reject/approve"\n\n\n';
    builder.Prompts.text(session, `${evText} ${optionMsg}`);
  },
  async function (session, result) {
    const action = result.response;
    const user = await getUserByEmail(session.userData.profile.email);
    const adminId = user && user._id;
    const rejectExp = /^reject$/;
    const approveExp = /^approve$/;  
    const approve =  approveExp.test(action);
    const reject = rejectExp.test(action);
    const confirmEvent = approve ? 'approved' : 'rejected';
    const ev = session.dialogData.event;
    const eventId = ev._id;
    const success = await approveOrRejectEvent(eventId, adminId, confirmEvent);
    if (success) {
      session.send(` ${reject ? 'rejected' : 'approved' }`);
    } else {
      session.send('ops... something wrong');
    }
    session.endDialog();
  },
]).cancelAction('cancelAction', 'Ok, canceled.', {
  matches: /^nevermind$|^cancel$/i
});

