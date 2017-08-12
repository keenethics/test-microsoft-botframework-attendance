import { bot } from '../bot.js';
import { getEvent, getEventDate } from '../helpers/events.js';
import { getAdmins } from '../helpers/users.js';
import builder from 'botbuilder';
export const notifyAdmins = async (eventId) => {
  const ev = await getEvent(eventId); 
  const admins = await getAdmins(); 
  admins.forEach(ad => {
    const { address } = ad;
    const msg = new builder.Message().address(address);
    const evText= `${getEventDate(ev)} ${ev.type} reason: ${ev.comment} user: ${ev.user} \n\n\n`;
    msg.text(evText);
    msg.textLocale('en-US');
    bot.send(msg);
    //bot.beginDialog(address, '/approveEvent', { event: ev });
  });
  return new Promise(function (resolve){ resolve('success'); });
};

