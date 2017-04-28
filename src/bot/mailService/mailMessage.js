const nodemailer = require('nodemailer');

let  transporter = nodemailer.createTransport({
  service: 'Gmail',
  auth: {
    user: 'keenethics.bot@gmail.com',
    pass: 'keenethics'
  }
});


function sendConfirmCode(mailOptions) {
  return new Promise(function(resolve) {
    transporter.sendMail(mailOptions, (err) => {
      if(err) {
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
