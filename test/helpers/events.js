import {
  describe,
  it,
} from 'mocha';
import { expect } from 'chai';
import moment from 'moment';
import { getEventDate } from '../../src/bot/helpers/events';

describe('getEventDate', () => {
  it('should return correct date', () => {
    const event = {
      startsAt: moment({ day: 22, month: 4, year: 2017 })._d,
      endsAt: moment({ day: 23, month: 4, year: 2017 })._d,
    };

    expect(getEventDate(event)).to.equal('May 22nd 2017');
  });

  it('should return correct date range', () => {
    const event = {
      startsAt: moment({ day: 22, month: 4, year: 2017 })._d,
      endsAt: moment({ day: 24, month: 4, year: 2017 })._d,
    };

    expect(getEventDate(event)).to.equal('May 22nd 2017 - May 24th 2017');
  });
});
