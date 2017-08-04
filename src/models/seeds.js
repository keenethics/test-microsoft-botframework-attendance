import faker from 'faker';
import mongoid from 'mongoid';

import Event from '../models/event.js';
import Users from '../models/users.js';
import Holidays from '../models/holidays.js';

const fromDate = new Date('04.01.2017');
const toDate = new Date('12.12.2017'); 

const randomHolidayNames = [
  'Lee-Jackson-King Day ',
  'Martin Luther King, Jr. Day ',
  'Groundhog Day ',
  'Darwin Day ',
  'Presidents Day ',
  'Confederate Memorial ',
  'Longtail Day ',
  'Patriot\'s Day ',
  'Earth Day ',
  'King\'s Day',
  'Constitution Day ',
  'Youth Day ',
  'Victoria Day ',
  'Flag Day ',
  'Juneteenth ',
  'Canada Day ',
  'Labor Day or Labour Day ',
  'Grandparents Day ',
  'Columbus Day ',
  'National Alphabet Day ',
  'Thanksgiving ',
  'Saint Nicholas Day ',
  'Boxing Day ',
  'Samhain ',
  'Winter Nights ',
  'Yule ',
  'Imbolc ',
  'Ostara/Easter ',
  'Beltane ',
  'Litha ',
  'Lughnasadh ',
  'Mabon/Harvest End ',
  'April Fools Day ',
  'Beluga Whale Day ',
  'Black Friday or Buy Nothing Day ',
  'Bloomsday ',
  'Brookemas ',
  'Christmas Eve ',
  'Festivus ',
  'First Contact Day ',
  'Friday the 13th',
  'Friendship Day (First Sunday in August)',
  'Galactic Tick Day ', 'GIS Day ', 'Giving Tuesday[1] ',
  'International Cannabis Day/Four Twenty ',
  'International Inflation Day ',
  'International Talk Like a Pirate Day ',
  'Lost Penny Day[2] ',
  'Marathon Monday ',
  'Mischief Night ',
  'Mole Day ',
  'Monkey Day ',
  'National Cancer Survivors Day ',
  'National Gorilla Suit Day', 
  'National Hug Day ',
  'Ninja Day ',
  'No Pants Day ',
  'Opposite Day ',
  'Pi Day ',
  'Put A Pillow On Your Fridge Day[3] ',
  'Record Store Day ',
  'Robert Burns Day/Burns Night ',
  'S.A.D. – ',
  'Star Wars Day ',
  'Super Bowl Sunday ',
  'Sweetest Day ',
  'Take Your Houseplant For A Walk Day ',
  'Tax Freedom Day',
  'Towel Day (25 May) (Tribute to the late Douglas Adams)',
  'Women Gamers Day (18 June) (Day for girls who enjoy video games)',
];

const generateRandomHoliday = (num) => {
  for (let i = 0; i < num; i++) {
    const rDate = randomDate(fromDate, toDate);
    const rName = randomHolidayNames[Math.floor(Math.random() * 70)];
    const rHol = new Holidays({ date: rDate, name: rName }); 
    Holidays.create(rHol);
  }
}

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
    if (err) return err;
  });
  Event.create(events);
  generateRandomHoliday(40); 
};

export default generateUsersAndEvents;

