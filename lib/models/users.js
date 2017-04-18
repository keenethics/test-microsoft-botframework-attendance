'use strict';

Object.defineProperty(exports, "__esModule", {
	value: true
});

var _mongoose = require('mongoose');

var _mongoose2 = _interopRequireDefault(_mongoose);

function _interopRequireDefault(obj) { return obj && obj.__esModule ? obj : { default: obj }; }

var UsersSchema = {
	name: String,
	email: String,
	usedVacations: Number,
	workedActually: [Number],
	workingDays: [Number]
};

var Users = _mongoose2.default.model('Users', UsersSchema);

exports.default = Users;