import moment from 'moment';

const nodemailer = require('nodemailer');
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
	'<br />To reject press the button <button>Reject</button><br />_id: ' + data._id;
	let mailOptions = {
		from: 'Keenethics bot',
		to: 'maxym.fedas@keenethics.com',
		subject: (data.type + ' request from ' + data.user),
		text: 'some text',
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
