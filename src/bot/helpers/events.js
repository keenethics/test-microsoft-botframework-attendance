import mongoose from 'mongoose';
import moment from 'moment';
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

export const getEventDate = (event) => {
  const { startsAt, endsAt } = event;
  const diff = moment(endsAt).diff(moment(startsAt), 'days');
  const dayoffs = diff > 1 ? `${moment(startsAt).format('MMMM Do YYYY')} - ${moment(endsAt).format('MMMM Do YYYY')}`
    : moment(startsAt).format('MMMM Do YYYY'); 
  return dayoffs;
};

export const cancelEvent = (eventId) => {
  return new Promise(function(resolve, reject) {
    Event.remove({ _id: eventId}, function(err){
      if (err) {
        reject(false);
      }
      resolve(true);
    });
  });
};

export const getEventsByIds = (ids, options = {}) => {
  return new Promise(function(resolve, reject) {
    const query = { _id: { $in: ids } };
    const queryWithOptions = Object.assign({}, query, options);   
    Event.find(queryWithOptions).sort('startsAt').exec(function(err, data){
      if(err) {
        reject(err);
      }
      resolve(data);
      
    });
  });
};

export const getPendingEvents = (adminId) => {
  return new Promise(function(resolve, reject) {
    const notRejected = { rejected: { $ne: `${adminId}` }};
    const notApproved = { approved: { $ne: `${adminId}` }};
    Event.find({$and: [notRejected, notApproved]})
      .sort('startsAt')
      .exec(function(err, data){
        if(err) {
          reject(err);
        }
        resolve(data);
      });
  });
};

export const getUsers = (userIds) => {
  return new Promise(function(resolve, reject) {
    const query = { _id: { $in: userIds } };
    Users.find(query)
      .select('email name _id')
      .exec(function(err, data){
        if(err) {
          reject(err);
        }
        resolve(data);
      });
  });
};

export const approveOrRejectEvent = (eventId, adminId, action) => {
  return new Promise(function(resolve, reject) {
    const query = { _id: eventId };
    const projection = { $addToSet: { [action]: adminId }};
    Event.update(query, projection)
      .exec(function(err, data){
        if (err) {
          reject(err);
        }
        resolve(data);
      });
  });
};

export const checkUserAvailabilityOnDate = (userEmail, date) => {
  return new Promise((resolve, reject) => {
    Users.findOne({email: userEmail}, (err, user) => {
      if (err) {
        reject('Sorry, something go wrong. :(');
        console.error(err);
      } else if (user) {
        getEventsByIds(user.events, {
          startsAt: {
            $lte: moment(date, 'DD.MM.YYYY').toDate(),
          },
          endsAt: {
            $gte: moment(date, 'DD.MM.YYYY').toDate(),
          },
        }).then((events) => {
          if (events.length) {
            resolve('He is on vacation');
          } else {
            resolve('He should be working on that date');
          }
        });
      } else {
        reject('User is not found.');
      }
    });
  });
};
