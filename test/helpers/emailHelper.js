import {
  describe,
  it,
} from 'mocha';
import { expect } from 'chai';
import emailHelper from '../../src/bot/helpers/emailHelper';

describe('validateEmail', () => {
  it('should return false if email is not on keenethics.com domain', () => {
    expect(emailHelper.validateEmail('somebody@gmail.com')).to.be.false;
  });

  it('should return true if email is on keenethics.com domain', () => {
    expect(emailHelper.validateEmail('somebody@keenethics.com')).to.be.true;
  });
});

describe('validateName', () => {
  it('should validate name', () => {
    expect(emailHelper.validateName('Alex')).to.be.true;
  });
});

describe('checkEmailOnTags', () => {
  it('detect if email is wrapped with tags', () => {
    const email = '<a href="mailto:somebody@keenethics.com>somebody@keenethics.com</a>';
    expect(emailHelper.checkEmailOnTags(email)).to.be.true;
  });
});

describe('getEmailOutOfTag', () => {
  it('detect if email is wrapped with tags', () => {
    const emailInTags = '<a href="mailto:somebody@keenethics.com>somebody@keenethics.com</a>';
    const email = 'somebody@keenethics.com';
    expect(emailHelper.getEmailOutOfTag(emailInTags)).to.equal(email);
  });
});
