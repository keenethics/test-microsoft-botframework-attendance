import mongoose from 'mongoose';

const Event = require('mongoose').model('Event').schema;

const MonthSchema = {
  _id: false,
  month: String,
  actuallyWorkedDays: Number,
};

const WorkingInfoSchema = {
  _id: false,
  year: Number,
  months: [MonthSchema]
};

const UsersSchema = {
  name: String,
  role: String,
  email: String,
  usedVacations: Number,
  sickLeaveLeft: Number,
  sickLeaveHalfLeft: Number,
  workingInfo: [WorkingInfoSchema],
  events: [Event],
  sessionAddress: Object,
};

const Users = mongoose.model('Users', UsersSchema);

export default Users;
