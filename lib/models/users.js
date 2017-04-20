'use strict';

Object.defineProperty(exports, "__esModule", {
	value: true
});

var _mongoose = require('mongoose');

var _mongoose2 = _interopRequireDefault(_mongoose);

function _interopRequireDefault(obj) { return obj && obj.__esModule ? obj : { default: obj }; }

var Event = require('mongoose').model('Event').schema;

var MonthSchema = {
	_id: false,
	month: String,
	actuallyWorkedDays: Number
};

var WorkingInfoSchema = {
	_id: false,
	year: Number,
	months: [MonthSchema]
};

var UsersSchema = {
	name: String,
	role: String,
	email: String,
	usedVacations: Number,
	sickLeaveLeft: Number,
	sickLeaveHalfLeft: Number,
	workingInfo: [WorkingInfoSchema],
	events: [Event]
};

var Users = _mongoose2.default.model('Users', UsersSchema);

exports.default = Users;