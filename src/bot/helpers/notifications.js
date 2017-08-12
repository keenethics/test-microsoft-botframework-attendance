import { bot } from '../bot.js';
import { getEvent } from '../helpers/events.js';
import { getAdmins } from '../helpers/users.js';

export const notifyAdmins = async (eventId) => {
  const ev = await getEvent(eventId); 
  const admins = await getAdmins(); 
  admins.forEach(ad => {
    const { address } = ad;
    bot.beginDialog(address, '/approveEvent', { event: ev });
  });
  return new Promise(function (resolve){ resolve('success'); });
};

