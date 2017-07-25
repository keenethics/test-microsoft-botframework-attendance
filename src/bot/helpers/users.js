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

export const getUserByEmail = (email) => {
  return new Promise(function(resolve, reject) {
    const users = mongoose.connection.model('Users');
    users.findOne({ email: email }, (err, info) => {
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
