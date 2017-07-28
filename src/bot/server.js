import restify from 'restify';
import { connector } from './bot.js';
import { mongoDeployUrl } from '../../settings.json';
import mongoose from 'mongoose';
import createUser from '../models/seeds.js';
import workers from './workers/index.js';

var createUsers = require('../models/db/defaultUsersDB.js');

var MongoClient = require('mongodb').MongoClient
  , assert = require('assert');


const mongourl = 
	process.env.NODE_ENV === 'development' ?
	'mongodb://localhost:27017/skypebot'
	: mongoDeployUrl;
   
mongoose.connect(mongourl);
createUsers(mongoose);

MongoClient.connect(mongourl, function(err, db) {
  assert.equal(null, err);
  console.info('Connected correctly to server');
  if (process.argv.indexOf('createUser')) {
    createUser();
  }
  db.close();
});

const server = restify.createServer();
server.listen(process.env.port || process.env.PORT || 3978, function () {
  console.info('%s listening to %s', server.name, server.mongourl); 
});
  
server.post('/api/messages', connector.listen());

export default server;
