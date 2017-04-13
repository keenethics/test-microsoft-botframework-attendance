var assert = require('assert');
var describe = require('mocha').describe;
var it = require('mocha').it;
var expect = require('chai').expect;
var should = require('chai').should();
var forTest = require('../testFile.js');

describe('Number check', function() {
	describe('return value', function() {
		it('should return number for a given string', function() {
			assert.equal(typeof forTest.convert('123'), 'number');
		});
	});
});



describe('Check EventSchema', function() {
	describe('should exist', function() {
		it('user should exist and be an object', function() {
			should.exist(forTest.user);
			forTest.user.should.be.an('object');
		});
	});
	describe('user properties', function() {
		it('should have startsAt and be a date', function() {
			forTest.user.should.have.property('startsAt');
			expect(forTest.user.startsAt).to.be.a('Date');
		});
	});
	describe('user properties', function() {
		it('should have endsAt and be a date', function() {
			forTest.user.should.have.property('endsAt');
			expect(forTest.user.endsAt).to.be.a('Date');
		});
	});
	describe('user properties', function() {
		it('should have type and be a string', function() {
			forTest.user.should.have.property('type');
			expect(forTest.user.type).to.be.a('string');
		});
	});
	describe('user properties', function() {
		it('should have comment and be a string', function() {
			forTest.user.should.have.property('comment');
			expect(forTest.user.comment).to.be.a('string');
		});
	});
	describe('user properties', function() {
		it('should have user and be a string', function() {
			forTest.user.should.have.property('user');
			expect(forTest.user.user).to.be.a('string');
		});
	});
	describe('user properties', function() {
		it('should have responses and be a array', function() {
			forTest.user.should.have.property('responses');
			expect(forTest.user.responses).to.be.a('Array');
		});
	});
});

