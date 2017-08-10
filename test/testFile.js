import { Event } from '../src/models/index';

var testData = {};

testData.user = new Event({
  startsAt: new Date(0),
  endsAt: new Date(),
  type: 'dayoff',
  comment: 'this is a comment',
  user: 'username',
  dummyData: 'dummy',
});

testData.convert = function (str) {
  return parseInt(str);
};

module.exports= testData;

