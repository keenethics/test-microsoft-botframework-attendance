import moment from 'moment';
var express = require('express');
var myParser =require('body-parser');
var app = express();
var rejectEventById = require('../models/db/methods/eventsMethods').rejectEventById;
const nodemailer = require('nodemailer');

app.use(myParser.urlencoded({extended:true}));

app.post('/rejectEvent', function(request) {
	rejectEventById(request.body.eventID);
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
	let html = '<span style="font-size: 16px; font-weight: bold">' + data.user + '</span> want take ' + data.type +
	'<br /> Starts at: ' + moment(data.startsAt).format('MMMM Do YYYY') + '<br /> Ends at: ' +
	moment(data.endsAt).format('MMMM Do YYYY') + '<br />Comment:' + data.comment +
	'<br />To reject press the button ' + '<form action="http://localhost:8080/rejectEvent" method="post">\
	<input type="hidden" name="eventID" value="' + data._id + '"><input type="submit" value="REJECT"></form>';
	let mailOptions = {
		from: 'Keenethics bot',
		to: 'maxym.fedas@keenethics.com',
		subject: (data.type + ' request from ' + data.user),
		html: html,
	};

	transporter.sendMail(mailOptions, (err) => {
		if (err) {
			callback('Sorry, somthing go wrong. Try later.');
			return console.log(err);
		}
		callback('Notification was delivered.');
	});
}


module.exports = {
	sendEmailAboutNewEvent: sendEmailAboutNewEvent
};
