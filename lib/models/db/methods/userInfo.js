'use strict';

var _mongoose = require('mongoose');

var _mongoose2 = _interopRequireDefault(_mongoose);

var _underscore = require('underscore');

var _underscore2 = _interopRequireDefault(_underscore);

var _index = require('../../index');

function _interopRequireDefault(obj) { return obj && obj.__esModule ? obj : { default: obj }; }

_mongoose2.default.Promise = require('bluebird');

var usersDB = _mongoose2.default.connection.model('Users');
var holidaysDB = _mongoose2.default.connection.model('Holidays');
var holidays = null;
holidaysDB.find(function (err, data) {
  if (err) {
    console.error(err);
  } else {
    holidays = data;
  }
});

function createUserInfoTextFromObject(user) {
  var answer = '';
  answer += 'Name: ' + user.name + '\n\n';
  answer += 'Email: ' + user.email + '\n\n';
  answer += 'Role: ' + user.role + '\n\n';
  answer += 'sickLeaveLeft: ' + user.sickLeaveLeft + '\n\n';
  answer += 'sickLeaveHalfLeft: ' + user.sickLeaveHalfLeft + '\n\n';
  var vacationDays = 0;
  var workedMonths = null;
  user.workingInfo.forEach(function (year) {
    holidays.forEach(function (yearHolidays) {
      if (_underscore2.default.isMatch(yearHolidays, { year: year.year })) {
        workedMonths = yearHolidays.months;
      }
    });
    year.months.forEach(function (month, index) {
      vacationDays += 20 / 12 * (month.actuallyWorkedDays / workedMonths[index].totalWorkingDays);
    });
  });
  vacationDays -= user.usedVacations;
  answer += 'Vacation days available: ' + parseInt(vacationDays);

  return answer;
}

function getInfoByEmail(email, callback) {
  usersDB.findOne({ email: email }, function (err, user) {
    var answer = void 0;
    if (err) {
      answer = 'Sorry, something go wrong. :(';
      console.error(err);
    } else if (user) {
      answer = createUserInfoTextFromObject(user);
    } else {
      answer = 'User is not found.';
    }
    callback(answer);
  });
}

function getInfoByName(name, callback) {
  usersDB.findOne({ name: name }, function (err, user) {
    var answer = void 0;
    if (err) {
      answer = 'Sorry, something go wrong. :(';
      console.error(err);
    } else if (user) {
      answer = createUserInfoTextFromObject(user);
    } else {
      answer = 'User is not found.';
    }
    callback(answer);
  });
}

function getRoleByUsername(username, callback) {
  usersDB.findOne({ name: username }, function (err, user) {
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
  return new Promise(function (resolve, reject) {
    usersDB.findOne({ email: userEmail }, function (err, user) {
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
  return new Promise(function (resolve, reject) {
    usersDB.findOne({ name: userName }, function (err, user) {
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
  return new Promise(function (resolve, reject) {
    new _index.Users(newUser).save(function (err, user) {
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
  registrateNewUser: registrateNewUser,
  getInfoByName: getInfoByName
};