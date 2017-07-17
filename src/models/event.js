import mongoose from 'mongoose';


const EventSchema = {
  startsAt: Date,
  endsAt: Date,
  type: String,
  comment: String,
  user: String,
  vacationsUsed: {type: Number, defaul: 0},
  daysOffUsed: {type: Number, defaul: 0},
  sickLeavesUsed: {type: Number, defaul: 0},
  rejected: {type: Array, default: []},
  createdAt: Date,
};


const Event = mongoose.model('Event', EventSchema);

export default Event;
