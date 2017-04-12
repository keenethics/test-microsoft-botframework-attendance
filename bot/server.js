import restify from 'restify';
import builder from 'botbuilder';
import { connector } from './bot.js';
import mongoose from 'mongoose';

var createUsers = require("../models/db/defaultUsersDB.js");

var MongoClient = require('mongodb').MongoClient
  , assert = require('assert');
   
mongoose.connect('mongodb://localhost:27017/skypebot');

const url = 'mongodb://localhost:27017/skypebot';

createUsers(mongoose);

MongoClient.connect(url, function(err, db) {
  assert.equal(null, err);
  console.log("Connected correctly to server");
 db.close();

});

const server = restify.createServer();
server.listen(process.env.port || process.env.PORT || 3978, function () {
   console.log('%s listening to %s', server.name, server.url); 
});
  
server.post('/api/messages', connector.listen());

export default server;
