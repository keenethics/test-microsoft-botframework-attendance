import Event from './models/event';
import moment from 'moment';
import mongoose from 'mongoose';
require('dotenv-extended').load();
import restify from 'restify';
import builder from 'botbuilder';

import { bot } from './bot/bot.js';
import server from './bot/server.js';
import dialogs from './bot/dialogs';

var MongoClient = require('mongodb').MongoClient
  , assert = require('assert');
  
const url = 'mongodb://localhost:27017/skypebot';