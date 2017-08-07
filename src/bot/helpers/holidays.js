import mongoose from 'mongoose';
import moment from 'moment';
const Holidays = mongoose.connection.model('Holidays');

export const getHolidays = (options) => {
  const query = {};
  const { month, year } = options;
  if (month && year) {
    const date = moment({ month, year })._d;
    const beforeDate = moment(date).clone().add('1', 'month')._d;
    const cond1 = { date: { $gte: `${date}` } };
    const cond2 = { date: { $lt: `${beforeDate}` } };
    const and = [cond1, cond2];
    query.$and = and;
  }
  return new Promise(function(resolve, reject) {
    Holidays.find(query)
      .sort('date')
      .exec((err, info) => {
        if (err) {
          reject(err);
        } else {
          resolve(info);
        }
      });
  });
};

export const addHoliday = (holiday) => {
  const holidays = mongoose.connection.model('Holidays');
  return new Promise(function(resolve, reject) {
    const Holiday = new holidays(holiday);
    Holiday.save((err) => {
      if (err) {
        reject(err);
      } else {
        resolve(holiday);
      }
    });			
  });
};


export const removeHoliday = (_id) => {
  const holidays = mongoose.connection.model('Holidays');
  return new Promise(function(resolve, reject) {
    holidays
      .remove({ _id: _id }) 
      .exec((err, res) => {
        if (err) {
          reject(null);
        } else {
          resolve(res);
        }
      });			
  });
};

