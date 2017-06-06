var assert = require('assert');
var builder = require('botbuilder');
var describe = require('mocha').describe;
var it = require('mocha').it;


describe('tests for functionality of dialogs ', function () {
  this.timeout(2000);
  it('should redirect to another dialog', done => {
    var connector = new builder.ConsoleConnector();
    var bot = new builder.UniversalBot(connector);
    bot.dialog('/', [
      (session) => {
        session.beginDialog('/child', { msg: 'toChild' });
      },
      (session, results) => {
        assert.equal(results.response.msg, 'answer');
        session.send('done');
      }
    ]);
    bot.dialog('/child', (session, args) => {
      assert.equal(args.msg, 'toChild');
      session.endDialogWithResult({ response: { msg: 'answer' } });
    });
    bot.on('send', (message) => {
      assert.equal(message.text, 'done');
      done();
    });
    connector.processMessage();
  });

  it('should process a waterfall of all built-in prompt', done => {
    var step = 0;
    var connector = new builder.ConsoleConnector();
    var bot = new builder.UniversalBot(connector);
    bot.dialog('/', [
      session => {
        assert.equal(session.message.text, 'start');
        builder.Prompts.text(session, 'enter text');
      },
      (session, results) => {
        assert.equal(results.response, '42');
        builder.Prompts.choice(session, 'make your choice', 'one|two|three');
      },
      (session, results) => {
        assert(results.response && results.response.entity === 'one');
        session.send('done');
      }
    ]);
    bot.on('send', message => {
      switch(++step) {
        case 1:
          assert.equal(message.text, 'enter text');
          connector.processMessage('42');
          break;
        case 2:
          connector.processMessage('one');
          break;
        case 3:
          assert.equal(message.text, 'done');
          done();
          break;
      }
    });
    connector.processMessage('start');
  });
});

