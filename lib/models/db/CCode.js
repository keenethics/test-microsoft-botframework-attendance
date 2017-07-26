'use strict';

Object.defineProperty(exports, "__esModule", {
  value: true
});
var CCODE = function () {
  function CCODE() {
    var d = new Date().getTime();
    var ccode = 'xxxxxxxxxx'.replace(/[xy]/g, function (c) {
      var r = (d + Math.random() * 16) % 16 | 0;
      d = Math.floor(d / 16);
      return (c == 'x' ? r : r & 0x3 | 0x8).toString(16).toUpperCase();
    });

    return ccode;
  }

  return CCODE;
}();

exports.CCODE = CCODE;