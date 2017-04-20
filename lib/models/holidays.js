'use strict';

Object.defineProperty(exports, "__esModule", {
	value: true
});

var _mongoose = require('mongoose');

var _mongoose2 = _interopRequireDefault(_mongoose);

function _interopRequireDefault(obj) { return obj && obj.__esModule ? obj : { default: obj }; }

var MonthSchema = {
	_id: false,
	month: String,
	holidaysDate: Array,
	totalWorkingDays: Number
};

var HolidaysSchema = {
	year: Number,
	months: [MonthSchema]
};

var Holidays = _mongoose2.default.model('Holidays', HolidaysSchema);

exports.default = Holidays;