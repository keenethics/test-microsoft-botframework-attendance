import {
  describe,
  it,
} from 'mocha';
import { expect } from 'chai';
import moment from 'moment';
import {
  validateDate,
  getMomentDDMMFormat,
} from '../../src/bot/helpers/date';

describe('getMomentDDMMFormat', () => {
  it('should return date from a string representation', () => {
    const date = '02.02.2017';
    const expectedDate = moment({ day: 2, month: 1, year: 2017 })._d.toString();
    expect(getMomentDDMMFormat(date).toString()).to.equal(expectedDate);
  });
});

describe('validateDate', () => {
  it('should return false if date is not dd.mm.yyyy', () => {
    const date = '02.13.2017';
    expect(validateDate(date)).to.equal(0);
  });

  it('should return true if date is dd.mm.yyyy', () => {
    const date = '13.02.2017';
    expect(validateDate(date)).to.not.equal(0);
  });
});
