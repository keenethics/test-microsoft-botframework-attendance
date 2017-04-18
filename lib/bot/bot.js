'use strict';

Object.defineProperty(exports, "__esModule", {
	value: true
});
exports.bot = exports.connector = undefined;

var _botbuilder = require('botbuilder');

var _botbuilder2 = _interopRequireDefault(_botbuilder);

function _interopRequireDefault(obj) { return obj && obj.__esModule ? obj : { default: obj }; }

var connector = exports.connector = new _botbuilder2.default.ChatConnector({
	appId: '79dc72c7-dc9b-43f6-9833-d12c0771f89b',
	appPassword: 'SmiHtU8Mpjx6QzQcQ9YjbXg'
});

var bot = exports.bot = new _botbuilder2.default.UniversalBot(connector);