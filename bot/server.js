import restify from 'restify';
import { connector } from './bot.js';
import mongoose from 'mongoose';

var createUsers = require('../models/db/defaultUsersDB.js');

var MongoClient = require('mongodb').MongoClient
  , assert = require('assert');


const mongourl = 
	process.env.NODE_ENV === 'development' ?
	'mongodb://localhost:27017/skypebot'
	: 'mongodb://michaelost123:123qweasdzxcv@ds139969.mlab.com:39969/skypebot123';
   
mongoose.connect(mongourl);

createUsers(mongoose);

MongoClient.connect(mongourl, function(err, db) {
	assert.equal(null, err);
	console.log('Connected correctly to server');
	db.close();

});

const server = restify.createServer();
server.listen(process.env.port || process.env.PORT || 3978, function () {
	console.log('%s listening to %s', server.name, server.mongourl); 
});
  
server.post('/api/messages', connector.listen());

export default server;
