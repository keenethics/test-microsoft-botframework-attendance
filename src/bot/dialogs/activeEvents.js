import { bot } from '../bot.js';
import builder from 'botbuilder';
import { getUserByEmail } from '../helpers/users.js';
import {  } from '../helpers/users.js';

bot.dialog('/activeEvents', [
  async function (session) {
    builder.Prompts.text(session, `your events ${session.userData.profile.email} `);
    
    const user = await getUserByEmail(session.userData.profile.email);
    builder.Prompts.text(session,`user ${user}`);
    session.endDialogWithResult();
    session.beginDialog('/menu');
  }
]);
