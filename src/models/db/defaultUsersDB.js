import { Users, Holidays } from '../../models';

import mongoose from 'mongoose';

module.exports = () => {
  dropAllCollections(false);

  mongoose.connection.model('Users').find({}, (err, d) => {
    if (!d.length) {
      fillUsersIfEmpty();
    }
  });
};


let fillUsersIfEmpty = () => {
  let months = ['January', 'February', 'March', 'April', 'May', 'June', 'July', 'August',
    'September', 'October', 'November', 'December'];
  let workedDaysInMonth = [10, 20, 22, 11];
  let user = {};
  let name = 'tester';
  let role = 'user';
  let email = 'tester@keenethics.com';
  let usedVacations = 0;
  let sickLeaveLeft = 5;
  let sickLeaveHalfLeft = 10;
  let workingInfo = [];
  let workingYear = {year: 2017, months: []};
  let events = [];
  workedDaysInMonth.map((workedDays, index) => {
    workingYear.months.push({month: months[index], actuallyWorkedDays: workedDays});
  });
  workingInfo.push(workingYear);
  user = {name, role, email,usedVacations, sickLeaveLeft, sickLeaveHalfLeft, workingInfo, events};
  new Users(user).save((err) => {
    if(err) {
      console.error(err);
    } else {
      console.info('db.users was filled with user \"' + name + '\"');
    }
  });

  workedDaysInMonth = [0, 0, 5, 6];
  user = {};
  name = 'admin';
  role = 'admin';
  email = 'admin@keenethics.com';
  usedVacations = 0;
  sickLeaveLeft = 1;
  sickLeaveHalfLeft = 4;
  workingInfo = [];
  workingYear = {year: 2017, months: []};
  workedDaysInMonth.map((workedDays, index) => {
    workingYear.months.push({month: months[index], actuallyWorkedDays: workedDays});
  });
  workingInfo.push(workingYear);
  user = {name, role, email,usedVacations, sickLeaveLeft, sickLeaveHalfLeft, workingInfo, events};
  new Users(user).save((err) => {
    if(err) {
      console.error(err);
    } else {
      console.info('db.users was filled with user \"' + name + '\"');
    }
  });

};


let dropAllCollections = (toDrop) => {
  if (!toDrop) return;
  mongoose.connection.model('Holidays').remove((err) => {
    if (err) {
      console.error(err);
    } else {
      console.info('db.holidays was dropped');
    }
  });

  mongoose.connection.model('Users').remove((err) => {
    if (err) {
      console.error(err);
    } else {
      console.info('db.users was dropped');
    }
  });

  mongoose.connection.model('Event').remove((err) => {
    if (err) {
      console.error(err);
    } else {
      console.info('db.events was dropped');
    }
  });
};
