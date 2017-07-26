'use strict';

Object.defineProperty(exports, "__esModule", {
  value: true
});
exports.setNotificationTime = exports.getUsers = exports.getUserByEmail = exports.getUser = undefined;

var _mongoose = require('mongoose');

var _mongoose2 = _interopRequireDefault(_mongoose);

function _interopRequireDefault(obj) { return obj && obj.__esModule ? obj : { default: obj }; }

var getUser = exports.getUser = function getUser(userName) {
  return new Promise(function (resolve, reject) {
    var users = _mongoose2.default.connection.model('Users');
    users.findOne({ name: userName }, function (err, info) {
      if (err) {
        reject(err);
      } else {
        resolve(info);
      }
    });
  });
};

var getUserByEmail = exports.getUserByEmail = function getUserByEmail(email) {
  return new Promise(function (resolve, reject) {
    var users = _mongoose2.default.connection.model('Users');
    users.findOne({ email: email }, function (err, info) {
      if (err) {
        reject(err);
      } else {
        resolve(info);
      }
    });
  });
};

var getUsers = exports.getUsers = function getUsers() {
  var users = _mongoose2.default.connection.model('Users');
  return new Promise(function (resolve, reject) {
    users.find({}).sort('email').select('email name').exec(function (err, data) {
      if (err) {
        reject(err);
      }
      resolve(data);
    });
  });
};

var setNotificationTime = exports.setNotificationTime = function setNotificationTime(userId, notificationTime) {
  var users = _mongoose2.default.connection.model('Users');
  return new Promise(function (resolve, reject) {
    users.update({ _id: userId }, { $set: { 'settings.notificationTime': notificationTime } }).exec(function (err, data) {
      if (err) {
        reject(err);
      }
      resolve(data);
    });
  });
};