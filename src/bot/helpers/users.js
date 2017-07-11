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


