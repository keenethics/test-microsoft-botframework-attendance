import faker from 'faker';
import mongoid from 'mongoid';
import moment from 'moment';
import Event from '../models/event.js';
import Users from '../models/users.js';
import Holidays from '../models/holidays.js';

const fromDate = new Date('04.01.2017');
const toDate = new Date('12.12.2017'); 
const randomHolidayNames = [
  'New Years Day', 
  'New Years Holiday', 
  'Orthodox Christmas Day', 
  'Women\'s Day', 
  'Orthodox Easter Monday', 
  'Labour Day', 
  'Labour Day Holiday', 
  'Victory Day', 
  'Orthodox Pentecost Monday', 
  'Constitution Day', 
  'Independence Day', 
  'Day of the Defender of Ukraine', 
  'Dignity and Freedom Day'
];

const generateRandomHoliday = (num) => {
  for (let i = 0; i < num; i++) {
    const rDate = randomDate(fromDate, toDate);
    const rName = randomHolidayNames[Math.floor(Math.random() * 13)];
    const rHol = new Holidays({ date: rDate, name: rName }); 
    Holidays.create(rHol);
  }
};

const getNewUser = ({ _id, email, role, events }) => {
  return {
    _id: _id || mongoid(),
    email: email || faker.internet.email(),
    events: events || [],
    workingInfo: [{}],
    role: role || new Date().getSeconds() % 2 == 0 ? 'user' : 'admin',
    sickLeaveHalfLeft: Math.floor((Math.random() * 10) + 1),
    sickLeaveLeft : Math.floor((Math.random() * 10) + 1),
    usedVacations : Math.floor((Math.random() * 10) + 1),
  };
};

const randomDate = (start, end) => {
  const diff = end.getTime() - start.getTime();
  const new_diff = diff * Math.random();
  return new Date(start.getTime() + new_diff);
};

const getNewEvent = ({_id, startsAt, endsAt, type, comment, rejected, approved, email }) => {
  const date1 = randomDate(fromDate, toDate);
  const date2 =  moment(date1).clone().add('days', Math.floor(Math.random() * 6) + 1);
  return {
    _id: _id || mongoid(),
    endsAt: endsAt || date1 > date2 ? date1 : date2,
    startsAt: startsAt || date1 > date2 ? date2 : date1,
    type: type || 'dayoff',
    comment: comment || 'no comment',
    user: email,
    approved: approved || [], 
    rejected: rejected || [], 
    createdAt: new Date(),
  };
};

const generateUsersAndEvents = () => {
  const admin = getNewUser({ role: 'admin' });
  const user = getNewUser({ role: 'user'});
  const approvedEvents = [];
  const rejectedEvents = [];
  const pendingEvents = [];
  for(let i=0; i<5; i++) {
    rejectedEvents.push(getNewEvent({ email: user.email, rejected: [admin._id], approved: [], }));
    approvedEvents.push(getNewEvent({ email: user.email, rejected: [], approved: [admin._id], }));
    pendingEvents.push(getNewEvent({ email: user.email, rejected: [], approved: [], }));
  }
  const events = rejectedEvents.concat(approvedEvents).concat(pendingEvents);
  user.events = events.map(e => (e._id));
  Users.create([user, admin], (err) => {
    if (err) return err;
  });
  Event.create(events);
  generateRandomHoliday(40); 
};

export default generateUsersAndEvents;

