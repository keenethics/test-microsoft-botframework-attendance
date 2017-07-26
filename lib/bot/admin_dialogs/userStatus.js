'use strict';

var _bot = require('../bot.js');

var _events = require('../helpers/events');

_bot.bot.dialog('/userStatus', [function (session, result) {
  if (session.userData.profile.role !== 'admin') {
    session.send('This feature available only for admins');
    session.endDialog();
    return;
  }

  var answer = result.matched.input;
  var userEmail = answer.match(/[a-zA-z0-9_.]+@keenethics.com/g)[0];
  var date = answer.match(/[0-9]{2}\.[0-9]{2}\.[0-9]{4}/)[0];

  (0, _events.checkUserAvailabilityOnDate)(userEmail, date).then(function (result) {
    session.send(result);
  });
  session.endDialog();
  session.beginDialog('/menu');
}]);