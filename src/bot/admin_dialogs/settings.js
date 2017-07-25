import { bot } from '../bot.js';
import builder from 'botbuilder';
import { setNotificationTime, getUserByEmail } from '../helpers/users.js';

bot.dialog('/settings', [
  async function(session) {
    if (session.userData.profile.role !== 'admin') {
      session.send('This feature available only for admins');
      session.endDialog();
      return;
    }
    const user = await getUserByEmail(session.userData.profile.email);
    session.dialogData.adminId = user && user._id;
    const notificationTime = user && user.settings && user.settings.notificationTime;
    const time = notificationTime ? `${notificationTime.hours}:${notificationTime.minutes}` : 'is not set';
    const msg = `Your notification time ${time}`;
    session.send(msg); 
    session.send('1. set notification time 2. menu 3. settings');
    builder.Prompts.text(session,' ?');
  },
  
  function (session, result) {
    const action = result.response;
    switch(action) {
      case 'menu':
        session.beginDialog('/menu');
        break;
      case 'settings':
        session.beginDialog('/settings');
        break;
      case 'set notification time':
        session.send('enter desired notification time (hh:mm)');
        break;
      default:
        session.send('incorrect data.. going to the main menu..');
        session.endDialog();
        session.beginDialog('/menu');
        break;
    }
    builder.Prompts.text(session,' ?');
  },

  function (session, result) {
    const time = result.response;
    const timeExp = /^([0-9]|0[0-9]|1[0-9]|2[0-3]):[0-5][0-9]$/;
    const passed = timeExp.test(time);
    if (passed) {
      setNotificationTime(session.dialogData.adminId, time);
      session.send(`notification time ${time} has been set`);
      session.endDialog();
    } else {
      session.send('time format is incorrect');
    }
  }
]);
