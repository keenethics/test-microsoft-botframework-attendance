'use strict';

Object.defineProperty(exports, "__esModule", {
  value: true
});
exports.getMomentDDMMFormat = exports.validateDate = undefined;

var _slicedToArray = function () { function sliceIterator(arr, i) { var _arr = []; var _n = true; var _d = false; var _e = undefined; try { for (var _i = arr[Symbol.iterator](), _s; !(_n = (_s = _i.next()).done); _n = true) { _arr.push(_s.value); if (i && _arr.length === i) break; } } catch (err) { _d = true; _e = err; } finally { try { if (!_n && _i["return"]) _i["return"](); } finally { if (_d) throw _e; } } return _arr; } return function (arr, i) { if (Array.isArray(arr)) { return arr; } else if (Symbol.iterator in Object(arr)) { return sliceIterator(arr, i); } else { throw new TypeError("Invalid attempt to destructure non-iterable instance"); } }; }();

var _moment = require('moment');

var _moment2 = _interopRequireDefault(_moment);

function _interopRequireDefault(obj) { return obj && obj.__esModule ? obj : { default: obj }; }

var reGoodDate = /^(?:(0[1-9]|[12][0-9]|3[01])[\/.](0[1-9]|1[012])[\/.](19|20)[0-9]{2})$/;

var isGoodDate = function isGoodDate(dt) {
  return reGoodDate.test(dt);
};

var validateDate = exports.validateDate = function validateDate(date) {
  return date.split('-').filter(function (d) {
    return isGoodDate(d);
  }).length;
};

var getMomentDDMMFormat = exports.getMomentDDMMFormat = function getMomentDDMMFormat(date) {
  if (!date) return;

  var _date$split = date.split('.'),
      _date$split2 = _slicedToArray(_date$split, 3),
      day = _date$split2[0],
      month = _date$split2[1],
      year = _date$split2[2];

  return (0, _moment2.default)({ day: day, month: month - 1, year: year })._d;
};