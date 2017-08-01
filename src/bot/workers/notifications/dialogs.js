import { bot } from '../../bot.js';

bot.dialog('/userAddedEvent', [
  function (session) {
    session.send('user has added event');
  },
 ]).cancelAction('cancelAction', 'Ok, canceled.', {
    matches: /^nevermind$|^cancel$/i
});

