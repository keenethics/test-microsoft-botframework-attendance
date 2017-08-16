import { bot } from '../bot.js';
import emailHelper from '../helpers/emailHelper';
import { filterQuotes } from '../helpers/dialogs.js';
const getInfoByName = require('../../models/db/methods/userInfo').getInfoByName;
const getInfoByEmail = require('../../models/db/methods/userInfo').getInfoByEmail;

const sendDataAndEndDialog = (session, data) => {
  session.send(data);
  session.endDialog();
  session.beginDialog('/menu');
};

bot.dialog('/infoOn', [
  function(session, result) {
    const filteredQuery = filterQuotes(result.matched.input);
    const answer = filteredQuery.replace(/info on /, ''); 
    if (answer === 'me') {
      getInfoByEmail(session.userData.profile.email, (data) => {
        sendDataAndEndDialog(session, data);
      });
    } else {
      // If user isn't admin end the dialog
      if (session.userData.profile.role !== 'admin') {
        sendDataAndEndDialog(session, 'This feature available only for admins');
        return;
      }

      // Check if answer is email address. If not, handle as a name
      if (emailHelper.validateEmail(answer)) {
        getInfoByEmail(answer, (data) => {
          sendDataAndEndDialog(session, data);
        });
      } else {
        getInfoByName(answer, (data) => {
          sendDataAndEndDialog(session, data);
        });
      }
    }
  },
]);
