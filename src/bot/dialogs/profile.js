import { bot } from '../bot.js';
import builder from 'botbuilder';
import { CCODE } from '../../models/db/CCode';


var checkUserEmail = require('../../models/db/methods/userInfo').checkUserEmail;
var usernameExist = require('../../models/db/methods/userInfo').usernameExist;
var registrateNewUser = require('../../models/db/methods/userInfo').registrateNewUser;
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
        if (validateEmail(results.response)) {
          session.send('There is no user with such email address.');
          session.userData.profile.email = results.response;
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
      session.send(`Welcome on board ${session.userData.profile.name}!`);
      session.endDialogWithResult({ response: session.userData.profile });
    }
  },

]);

bot.dialog('/newUserRegistration', [
  function(session, args) {
    if (!args || !args.invalidName) {
      session.send('Welcome to new user registration. Enter \"/cancel\" to exit.');
      builder.Prompts.text(session, 'Enter your name:');
    } else {
      builder.Prompts.text(session, 'Enter valid name:');
    }
  },
  async function(session, results) {
    if (results.response == '/cancel') {
      session.replaceDialog('/ensureProfile');
    } else {
      if (validateName(results.response)) {
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

function validateEmail(email) {
  var re = /^(([^<>()\[\]\\.,;:\s@"]+(\.[^<>()\[\]\\.,;:\s@"]+)*)|(".+"))@keenethics.com$/;
  return re.test(email);
}

function validateName(name) {
  if (name.length < 4 || name.length > 20) return false;
  var re = /^(([^<>()\[\]\\.,;:\s@"]+(\.[^<>()\[\]\\.,;:\s@"]+)*)|(".+"))$/;
  return re.test(name);
}
