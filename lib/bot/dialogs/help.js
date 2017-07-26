'use strict';

var _bot = require('../bot.js');

var userOptions = 'You can: - day off - edit profile - info on me - vacation - active events';
var adminOptions = 'You can: - day off - edit profile - info on me / email / Name - vacation - ' + 'active events - change info - confirm events - settings - events on - What\'s email status on dd.mm.yyyy';

_bot.bot.dialog('/help', [function (session) {
  if (session.userData.profile.role !== 'admin') {
    session.send(userOptions);
  } else {
    session.send(adminOptions);
  }
  session.endDialog();
}]);