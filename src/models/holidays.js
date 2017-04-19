import mongoose from 'mongoose';


const MonthSchema = {
	_id: false,
	month: String,
	holidaysDate: Array,
	totalWorkingDays: Number,
};

const HolidaysSchema = {
	year: Number,
	months: [MonthSchema],
};


const Holidays = mongoose.model('Holidays', HolidaysSchema);

export default Holidays;
