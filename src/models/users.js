import mongoose from 'mongoose';


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
  role: {type: String, default: 'user'},
  email: String,
  usedVacations: {type: Number, default: 0},
  sickLeaveLeft: {type: Number, default: 5},
  sickLeaveHalfLeft: {type: Number, default: 10},
  workingInfo: [WorkingInfoSchema],
  startWorkingDay: Date,
  events: [String],
};

const Users = mongoose.model('Users', UsersSchema);

export default Users;
