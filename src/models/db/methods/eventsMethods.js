import mongoose from 'mongoose';

let eventsDB = mongoose.connection.model('Event');

function rejectEventById(event_id, reason) {
	eventsDB.update({_id: event_id}, {$set: {isReject: true, rejectReason: reason}}, (err) => {
		if (err) {
			return console.log(err);
		}
		console.log('Event %s was rejected', event_id);
	});
}

module.exports = {
	rejectEventById: rejectEventById
};
