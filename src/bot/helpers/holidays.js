import mongoose from 'mongoose';
const Holidays = mongoose.connection.model('Holidays');

export const getHolidays = (options) => {
  const query = {};
  const { month, year } = options;
  if (month && year) {
    const date = moment({ month, year });
    qyery.date = { $gte: `${date}` };
  }
  return new Promise(function(resolve, reject) {
    Holidays.find({}, (err, info) => {
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
    const { _id } = Holiday;
    Holiday.save((err) => {
      if (err) {
        reject(err);
      } else {
        resolve(holiday);
      }
    });			
  });
};

