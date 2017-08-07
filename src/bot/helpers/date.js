import moment from 'moment';

const reGoodDate = /^(?:(0[1-9]|[12][0-9]|3[01])[\/.](0[1-9]|1[012])[\/.](19|20)[0-9]{2})$/;

const isGoodDate = (dt) => {
  return reGoodDate.test(dt);
};

export const validateDate = (date) => (date.split('-').filter((d)=>((isGoodDate(d)))).length);

export const getMomentDDMMFormat = (date) => {
  if (!date) return;
  const [day, month, year] = date.split('.');
  return moment({ day, month: month, year })._d;
};

export const formatDate = (date) => (moment(date).format('MMMM Do YYYY'));
