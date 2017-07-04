import { bot } from '../bot.js';
import builder from 'botbuilder';
import { CCODE } from '../../models/db/CCode';
import emailHelper from '../helpers/emailHelper';


var checkUserEmail = require('../../models/db/methods/userInfo').checkUserEmail;
var usernameExist = require('../../models/db/methods/userInfo').usernameExist;
var registrateNewUser = require('../../models/db/methods/userInfo').registrateNewUser;
var sendConfirmCode = require('../mailService/mailMessage').sendConfirmCode;
var user = {};

bot.dialog('/ensureProfile', [
  function (session, args) {
    session.userData.confirm = false;
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
      let userEmail = results.response;
      if (emailHelper.checkEmailOnTags(userEmail)) {
        userEmail = emailHelper.getEmailOutOfTag(userEmail);
      }
      user = await checkUserEmail(userEmail);
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
        if (emailHelper.validateEmail(userEmail)) {
          session.send('There is no user with such email address.');
          session.userData.profile.email = userEmail;
          session.replaceDialog('/newUserRegistration');
        } else {
          session.send('Invalid email. Only \"@keenethics.com\" domain allowed.');
          session.replaceDialog('/ensureProfile', { reprompt: true });
        }
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
      session.userData.confirm = true;
      session.send(`Welcome on board ${session.userData.profile.name}!`);
      session.endDialogWithResult({ response: session.userData.profile });
    }
  },

]);

bot.dialog('/newUserRegistration', [
  function(session, args) {
    if (!args || !args.invalidName) {
      session.send('Welcome to new user registration. Enter \"-cancel\" to exit.');
      builder.Prompts.text(session, 'Enter your name:');
    } else {
      builder.Prompts.text(session, 'Enter valid name:');
    }
  },
  async function(session, results) {
    if (results.response == '-cancel') {
      session.replaceDialog('/ensureProfile');
    } else {
      if (emailHelper.validateName(results.response)) {
        if (await usernameExist(results.response)) {
          session.send('This name already exist!');
          session.replaceDialog('/newUserRegistration', {invalidName: true});
        } else {
          session.userData.profile.name = results.response;
          var ccode = CCODE();
          session.userData.profile.ccode = ccode;
          let mailOptions = {
            from: 'keenethics',
            to: session.userData.profile.email,
            subject: 'Confirmation code',
            text: ccode
          };
          var sendResult = await sendConfirmCode(mailOptions);
          if (sendResult) {
            builder.Prompts.text(session, `Confirmation code was send to ${session.userData.profile.email}. Please paste
               it here:`);
          } else {
            session.send('Sorry. Something go wrong, try once more later.');
            session.replaceDialog('/newUserRegistration');
          }
        }
      } else {
        session.send('Invalid name!');
        session.replaceDialog('/newUserRegistration', {invalidName: true});
      }
    }
  },
  async function (session, results) {
    if (session.userData.profile.ccode != results.response) {
      session.send('Wrong confirmation code');
      session.replaceDialog('/newUserRegistration');
    } else {
      var newUser = {
        name: session.userData.profile.name,
        email: session.userData.profile.email
      };
      user = await registrateNewUser(newUser);
      session.userData.profile.email = user.email;
      session.userData.profile.name = user.name;
      session.userData.profile.role = user.role;
      session.send('You are successfully registrated.');
      session.send(`Welcome on board ${session.userData.profile.name}!`);
      session.endDialogWithResult({ response: session.userData.profile });
    }
  },
]);
