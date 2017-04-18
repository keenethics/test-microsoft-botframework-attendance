'use strict';

Object.defineProperty(exports, "__esModule", {
	value: true
});

var _restify = require('restify');

var _restify2 = _interopRequireDefault(_restify);

var _bot = require('./bot.js');

var _mongoose = require('mongoose');

var _mongoose2 = _interopRequireDefault(_mongoose);

function _interopRequireDefault(obj) { return obj && obj.__esModule ? obj : { default: obj }; }

var createUsers = require('../models/db/defaultUsersDB.js');

var MongoClient = require('mongodb').MongoClient,
    assert = require('assert');

var mongourl = process.env.NODE_ENV === 'development' ? 'mongodb://localhost:27017/skypebot' : 'mongodb://michaelost123:123qweasdzxcv@ds139969.mlab.com:39969/skypebot123';

_mongoose2.default.connect(mongourl);

createUsers(_mongoose2.default);

MongoClient.connect(mongourl, function (err, db) {
	assert.equal(null, err);
	console.log('Connected correctly to server');
	db.close();
});

var server = _restify2.default.createServer();
server.listen(process.env.port || process.env.PORT || 3978, function () {
	console.log('%s listening to %s', server.name, server.mongourl);
});

server.post('/api/messages', _bot.connector.listen());

exports.default = server;