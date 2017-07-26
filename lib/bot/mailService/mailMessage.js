'use strict';

var smtpTransport = require('nodemailer-smtp-transport');
var nodemailer = require('nodemailer');

var transporter = nodemailer.createTransport(smtpTransport({
  service: 'Gmail',
  auth: {
    user: 'keenethics.bot@gmail.com',
    pass: 'keenethics'
  }
}));

function sendConfirmCode(mailOptions) {
  return new Promise(function (resolve) {
    transporter.sendMail(mailOptions, function (err) {
      if (err) {
        console.error(err);
        resolve(false);
      } else {
        resolve(true);
      }
    });
  });
}

module.exports = {
  sendConfirmCode: sendConfirmCode
};