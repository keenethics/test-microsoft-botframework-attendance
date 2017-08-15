import restify from 'restify';
import { connector } from './bot.js';
import mongoose from 'mongoose';
import createUser from '../models/seeds.js';

const mongoDeployUrl = 
  process.env.NODE_ENV === 'development' ?
  require('../../settings.json').mongoDeployUrl
  : process.env.mongoDeployUrl; 

const createUsers = require('../models/db/defaultUsersDB.js');

const MongoClient = require('mongodb').MongoClient
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
