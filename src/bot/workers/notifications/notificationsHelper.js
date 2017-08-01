const mongoose = require('mongoose');
const Events = require('../../../models/event.js');
const Users = require('../../../models/users.js');

module.exports.getAdmins = () => {
  return new Promise(function(resolve, reject) {
    Users.find({role: 'admin' }, (err, info) => {
      if (err) {
        reject(err);
        
      } else {
        resolve(info);
      }
    });
  });
};

module.exports.getPendingEvents = (adminId) => {
  return new Promise(function(resolve, reject) {
    const notRejected = { rejected: { $not: { $elemMatch: { $eq: `${adminId}` } } } };
    const notApproved = { approved: { $not: { $elemMatch: { $eq: `${adminId}` } } } };
    const query = { $and: [notRejected, notApproved] };
    Events.find(query, (err, info) => {
      if (err) {
        reject(err);
      } else {
        resolve(info);
      }
    });
  });
};

