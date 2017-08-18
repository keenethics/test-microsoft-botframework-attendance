import mongoose from 'mongoose';

export const getUser = (userName) => {
  return new Promise(function(resolve, reject) {
    const users = mongoose.connection.model('Users');
    users.findOne({ name: userName }, (err, info) => {
      if (err) {
        reject(err);
      } else {
        resolve(info);
      }
    });
  });
};

export const getAdmins = () => {
  return new Promise(function(resolve, reject) {
    const users = mongoose.connection.model('Users');
    users.find({ role: 'admin' }, (err, info) => {
      if (err) {
        reject(err);
      } else {
        resolve(info);
      }
    });
  });
};

export const getUserByEmail = (email) => {
  return new Promise(function(resolve, reject) {
    const users = mongoose.connection.model('Users');
    users.findOne({ email: email }, { email: 1, address: 1, name:1, events: 1, role: 1 }, (err, info) => {
      if (err) {
        reject(err);
      } else {
        resolve(info);
      }
    });
  });
};

export const getUsers = () => {
  const users = mongoose.connection.model('Users');
  return new Promise(function (resolve, reject) {
    users.find({})
      .sort('email')
      .select('email name')
      .exec(function(err, data){
        if(err) {
          reject(err);
        }
        resolve(data);
      });
  });
};

export const setNotificationTime = (userId, notificationTime) => {
  const users = mongoose.connection.model('Users');
  return new Promise(function (resolve, reject) {
    users.update({ _id: userId }, { $set: { 'settings.notificationTime': notificationTime }})
      .exec(function(err, data){
        if (err) {
          reject(err);
        }
        resolve(data);
      });
  });
};

export const updateUser = ({ email, userId, role }) => {
  const users = mongoose.connection.model('Users');
  return new Promise(function (resolve, reject) {
    const query = {};
    if (email) query.email = email;
    if (userId) query._id = userId;
    let projection = { $set: {} };
    if (role) { projection.$set.role = role; }
    users.update(query, projection)
      .exec(function(err, data){
        if (err) {
          reject(null);
        }
        resolve(data);
      });
  });
};

