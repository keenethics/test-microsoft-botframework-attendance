import mongoose from 'mongoose';
import _ from 'underscore';
import { Users } from '../../index';
mongoose.Promise = require('bluebird');


let usersDB = mongoose.connection.model('Users');
let holidaysDB = mongoose.connection.model('Holidays');
let holidays = null;
holidaysDB.find((err, data) => {
  if (err) {
    console.error(err);
  } else {
    holidays = data;
  }
});

function getInfoByEmail(email, callback) {
  usersDB.findOne({email: email}, (err, user) => {
    var answer;
    if (err) {
      answer = 'Sorry, something go wrong. :(';
      console.error(err);
    } else if (user) {
      answer = 'Name: ' + user.name + '\n\n';
      answer += 'Email: ' + user.email + '\n\n';
      answer += 'Role: ' + user.role + '\n\n';
      answer += 'sickLeaveLeft: ' + user.sickLeaveLeft + '\n\n';
      answer += 'sickLeaveHalfLeft: ' + user.sickLeaveHalfLeft + '\n\n';
      var vacationDays = 0;
      var workedMonths = null;
      user.workingInfo.forEach((year) => {
        holidays.forEach((yearHolidays) => {
          if (_.isMatch(yearHolidays, {year: year.year})) {
            workedMonths = yearHolidays.months;
          }
        });
        year.months.forEach((month, index) => {
          vacationDays += (20 / 12) * (month.actuallyWorkedDays / workedMonths[index].totalWorkingDays);
        });
      });
      vacationDays -= user.usedVacations;
      answer += 'Vacation days available: ' + parseInt(vacationDays);
    } else {
      answer = 'User is not found.';
    }
    callback(answer);
  });
}


function getRoleByUsername(username, callback) {
  usersDB.findOne({name: username}, (err, user) => {
    if (err) {
      console.error(err);
    }
    if (user) {
      callback(user.role);
    } else {
      callback('user');
    }
  });
}


function checkUserEmail(userEmail) {
  return new Promise(function(resolve, reject) {
    usersDB.findOne({email: userEmail}, (err, user) => {
      if (err) {
        console.error(err);
        reject(err);
      } else {
        resolve(user);
      }
    });
  });
}


function usernameExist(userName) {
  return new Promise(function(resolve, reject) {
    usersDB.findOne({name: userName}, (err, user) => {
      if (err) {
        console.error(err);
        reject(err);
      }
      if (user) {
        resolve(true);
      } else {
        resolve(false);
      }
    });
  });
}


function registrateNewUser(newUser) {
  return new Promise(function(resolve, reject) {
    new Users(newUser).save((err, user) => {
      if (err) {
        console.error(err);
        reject(err);
      } else {
        resolve(user);
      }
    });
  });
}


module.exports = {
  getInfoByEmail: getInfoByEmail,
  getRoleByUsername: getRoleByUsername,
  checkUserEmail: checkUserEmail,
  usernameExist: usernameExist,
  registrateNewUser: registrateNewUser
};
