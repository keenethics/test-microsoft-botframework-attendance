import { bot } from '../bot.js';
import builder from 'botbuilder';
import { CCODE } from '../../models/db/CCode';


var checkUserEmail = require('../../models/db/methods/userInfo').checkUserEmail;
var sendConfirmCode = require('../mailService/mailMessage').sendConfirmCode;
var user = {};

bot.dialog('/ensureProfile', [
  function (session, args) {
    if (!session.userData) session.userData = {};
    session.userData.profile = args || {};
    if (!args) {
      builder.Prompts.text(session, `Greetings ${session.message.user.name}, what's your email?` );
    } else {
      builder.Prompts.text(session, 'Enter valid email');
    }
  },
  async function (session, results) {
    if (results.response) {
      user = await checkUserEmail(results.response);
      var ccode = CCODE();
      session.userData.profile.ccode = ccode;
      if (user) {
        let mailOptions = {
          from: 'keenethics',
          to: user.email,
          subject: 'Confirmation code',
          text: ccode
        };
        var sendResult = await sendConfirmCode(mailOptions);
        if (sendResult) {
          builder.Prompts.text(session, `Confirmation code was send to ${user.email}. Please paste it here:`);
        } else {
          session.send('Sorry. Something go wrong, try once more later.');
          session.replaceDialog('/ensureProfile');
        }
      } else {
        session.send('This email doesn\'t registrated. Check the correctness of the input.');
        session.replaceDialog('/ensureProfile', { reprompt: true });
      }
    }
  },
  function (session, results) {
    if (session.userData.profile.ccode != results.response) {
      session.send('Wrong confirmation code');
      session.replaceDialog('/ensureProfile', {reprompt: true});
    } else {
      session.userData.profile.email = user.email;
      session.userData.profile.name = user.name;
      session.userData.profile.role = user.role;
      session.send(`Welcome on board ${session.userData.profile.name}!`);
      session.endDialogWithResult({ response: session.userData.profile });
    }
  },

]);
