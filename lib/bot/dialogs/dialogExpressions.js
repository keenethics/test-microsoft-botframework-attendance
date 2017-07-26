"use strict";

Object.defineProperty(exports, "__esModule", {
  value: true
});
var eventsOn = exports.eventsOn = /^(rejected |approved |pending )*(events on){1}.+$/i;
var ofEmail = exports.ofEmail = /of \w+@[a-zA-Z_]+?\.[a-zA-Z]{2,3}$/;