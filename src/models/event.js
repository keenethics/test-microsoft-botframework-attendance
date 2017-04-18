import mongoose from 'mongoose';

const EventSchema = {
	startsAt: Date,
	endsAt: Date,
	type: String,
	comment: String,
	user: String,
	responses: Array,
};

const Event = mongoose.model('Event', EventSchema);

export default Event;
