import mongoose from 'mongoose';
import Event from '../../models/event.js';
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
    DayOff.save((err) => {
      if (err) {
        reject(err);
      } else {
        resolve('saved...');
      }
    });			
  });
};

