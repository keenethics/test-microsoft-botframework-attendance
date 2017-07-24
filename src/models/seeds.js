import faker from 'faker';
import mongoid from 'mongoid';

import Event from '../models/event.js';
import Users from '../models/users.js';

const fromDate = new Date('04.01.2017');
const toDate = new Date('12.12.2017'); 

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
    const diff =  end.getTime() - start.getTime();
    const new_diff = diff * Math.random();
    return new Date(start.getTime() + new_diff);
};

const getNewEvent = ({_id, startsAt, endsAt, type, comment, rejected, approved, email }) => {
  const date1 = randomDate(fromDate, toDate);
  const date2 = randomDate(fromDate, toDate);
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
    if (err) console.log(err); 
  });
  Event.create(events);
};

export default generateUsersAndEvents;

