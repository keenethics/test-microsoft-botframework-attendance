import { bot } from '../bot.js';
import { getEvent } from '../helpers/events.js';
import { getAdmins } from '../helpers/users.js';

export const notifyAdmins = async (eventId) => {
  const ev = await getEvent(eventId); 
  const admins = await getAdmins(); 
  console.log('admins');
  console.log(admins);
  console.log('ev');
  console.log(ev);
  admins.forEach(ad => {
    const { address } = ad;
    bot.beginDialog(address, '/approveEvent', { event: ev });
  });
};

