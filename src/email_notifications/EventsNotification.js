import { bot } from '../bot/bot.js';
import builder from 'botbuilder';
import moment from 'moment';


var express = require('express');
var myParser =require('body-parser');
var app = express();
var rejectEventById = require('../models/db/methods/eventsMethods').rejectEventById;
var getSessionAddressForUser = require('../models/db/methods/usersMethods').getSessionAddressForUser;

const nodemailer = require('nodemailer');

app.use(myParser.urlencoded({extended:true}));

app.post('/rejectEvent', function(request) {
  rejectEventById(request.body.eventID, request.body.reason);
  sendNotificationAboutEventReject(request.body);
});

app.listen(8080);

let transporter = nodemailer.createTransport({
  service: 'gmail',
  auth: {
    user: 'keenethics.bot@gmail.com',
    pass: 'keenethics'
  }
});



function sendEmailAboutNewEvent(data, callback) {
  let startsAt = moment(data.startsAt).format('MMMM Do YYYY');
  let endsAt = moment(data.endsAt).format('MMMM Do YYYY');
  let html = '<span style="font-size: 16px; font-weight: bold">' + data.user + '</span> want take ' + data.type +
	'<br /> Starts at: ' + startsAt + '<br /> Ends at: ' + endsAt + '<br />Comment: ' + data.comment +
		'<br /><br />To reject press the button below:' + '<form action="http://localhost:8080/rejectEvent" method="post">\
	<input type="hidden" name="eventID" value="' + data._id + '">\
	<input type="hidden" name="startsAt" value="' + startsAt + '">\
	<input type="hidden" name="endsAt" value="' + endsAt + '">\
	<input type="hidden" name="username" value="' + data.user + '">\
	<div><span>Reason:</span><input type="text" name="reason"><input type="submit" value="REJECT"></div></form>';
  let mailOptions = {
    from: 'Keenethics bot',
    to: 'maxym.fedas@keenethics.com',
    subject: (data.type + ' request from ' + data.user),
    html: html,
  };

  transporter.sendMail(mailOptions, (err) => {
    if (err) {
      callback('Sorry, somthing go wrong. Try later.');
      return console.error(err);
    }
    callback('Notification was delivered.');
  });
}


function sendNotificationAboutEventReject(eventData) {
  var eventMsg = 'Sorry, but your event id:' + eventData.eventID + '\n\nStartsAt date: ' + eventData.startsAt +
	'\n\nEndsAt date: ' + eventData.endsAt + '\n\nwas rejected by the reason "' + eventData.reason + '".';
  getSessionAddressForUser(eventData.username, function(_address){
    var msg = new builder.Message()
			.text(eventMsg)
			.address(_address);
    bot.send(msg);
  });
}


module.exports = {
  sendEmailAboutNewEvent: sendEmailAboutNewEvent
};
