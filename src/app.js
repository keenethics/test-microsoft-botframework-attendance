/* eslint-disable */

import Event from './models/event';
import moment from 'moment';
import mongoose from 'mongoose';
import restify from 'restify';
import builder from 'botbuilder';
import { bot } from './bot/bot.js';
import server from './bot/server.js';
import dialogs from './bot/dialogs';
