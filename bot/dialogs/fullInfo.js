import { bot } from '../bot.js'
import builder from 'botbuilder';
import moment from 'moment';
import { Users } from '../../models';
import mongoose from 'mongoose';

bot.dialog('/fullInfo', [
  function(session) {
    var usersDB = mongoose.connection.model('Users');
    usersDB.findOne({name: session.userData.profile.name}, function(err, user) {
      var answer = 'Sorry, not enough information. :(';
      if (user) {
        answer = 'Name: ' + user.name + '\n\n';
        answer += 'Email: ' + user.email + '\n\n';
        answer += 'Actualy days worked: ' + user.workedActually + '\n\n';
        answer += 'Working days : ' + user.workingDays + '\n\n';
        var vacationDays = 0;
        for (var i = 0; i < 12; i++) {
          vacationDays += (20 / 12) * (user.workedActually[i] / user.workingDays[i]);
        }
        vacationDays -= user.usedVacations;
        answer += 'You have: ' + parseInt(vacationDays) + ' vacation days left';
      }
      session.send(answer);
    });
    session.endDialog();
  }
]);
