var assert = require('assert');
var describe = require('mocha').describe;
var it = require('mocha').it;
var expect = require('chai').expect;
var should = require('chai').should();
var forTest = require('../testFile.js');

describe('Number check', () => {
	describe('return value', () => {
		it('should return number for a given string', () => {
			assert.equal(typeof forTest.convert('123'), 'number');
		});
	});
});



describe('Check EventSchema', () => {
	describe('should exist', () => {
		it('user should exist and be an object', () => {
			should.exist(forTest.user);
			forTest.user.should.be.an('object');
		});
	});

	describe('check properties', () => {
		it('should have startsAt and be a date', () => {
			forTest.user.should.have.property('startsAt');
			expect(forTest.user.startsAt).to.be.a('Date');
		});

		it('should have endsAt and be a date', () => {
			forTest.user.should.have.property('endsAt');
			expect(forTest.user.endsAt).to.be.a('Date');
		});

		it('should have type and be a string', () => {
			forTest.user.should.have.property('type');
			expect(forTest.user.type).to.be.a('string');
		});

		it('should have comment and be a string', () => {
			forTest.user.should.have.property('comment');
			expect(forTest.user.comment).to.be.a('string');
		});

		it('should have user and be a string', () => {
			forTest.user.should.have.property('user');
			expect(forTest.user.user).to.be.a('string');
		});

		it('should have responses and be a array', () => {
			forTest.user.should.have.property('responses');
			expect(forTest.user.responses).to.be.a('Array');
		});
	});
});

