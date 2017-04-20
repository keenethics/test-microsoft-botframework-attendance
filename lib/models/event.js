'use strict';

Object.defineProperty(exports, "__esModule", {
	value: true
});

var _mongoose = require('mongoose');

var _mongoose2 = _interopRequireDefault(_mongoose);

function _interopRequireDefault(obj) { return obj && obj.__esModule ? obj : { default: obj }; }

var EventSchema = {
	startsAt: Date,
	endsAt: Date,
	type: String,
	comment: String,
	user: String,
	//responses: Array,
	vacationsUsed: { type: Number, defaul: 0 },
	daysOffUsed: { type: Number, defaul: 0 },
	sickLeavesUsed: { type: Number, defaul: 0 },
	isReject: { type: Boolean, default: false }
};

var Event = _mongoose2.default.model('Event', EventSchema);

exports.default = Event;