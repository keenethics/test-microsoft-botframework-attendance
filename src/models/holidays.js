import mongoose from 'mongoose';

const HolidaysSchema = {
  name: String,
  date: Date,
};


const Holidays = mongoose.model('Holidays', HolidaysSchema);

export default Holidays;
