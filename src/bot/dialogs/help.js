import { bot } from '../bot.js';

bot.dialog('/help', [
  function(session) {
    if (session.userData.profile.role != 'admin') {
      session.send('You can : 1. day off 2. edit profile 3.full info 5.vacation 6.active events');
    }else{
      session.send('You can : 1. day off 2. editprofile 3.full info 4. user info 5.change info 6.vacation 7.active events');
    }
    session.endDialog();
  }
]);
