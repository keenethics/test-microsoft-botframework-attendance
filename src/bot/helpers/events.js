import mongoose from 'mongoose';
import Event from '../../models/event.js';
import Users from '../../models/users.js';

export const getHolidays = () => {
  return new Promise(function(resolve, reject) {
    const holidays = mongoose.connection.model('Holidays');
    holidays.find({ year: 2017 }, (err, info) => {
      if (err) { 
        reject(err.reason);
      } else {
        const workedMonths = info[0] && info[0].months;
        resolve(workedMonths);
      }
    });
  });
};

export const saveEvent = (dayoff) => {
  return new Promise(function(resolve, reject) {
    const DayOff = new Event(dayoff);
    const { _id } = DayOff;
    DayOff.save((err) => {
      if (err) {
        reject(null);
      } else {
        resolve(_id);
      }
    });			
  });
};

export const saveEventIntoUser = (userId, eventId) => {
  return new Promise(function(resolve, reject) {
    Users.update({ _id: userId }, { $addToSet: { events: eventId }} ,(err) => {
      if (err) {
        reject(err);
      } else {
        resolve('success');
      }
    });			
  }); 
};
