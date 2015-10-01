'use strict';

var sinon = require('sinon');
var thru = require('../../lib/server/utils/thru');
var mongo = require('../../lib/server/persistence/mongo');

const STUB_DB = { close: function() {} };

describe('mongo module', () => {
  describe('execute(fn) method', () => {
    var connectStub;
    beforeAll(() => {
      connectStub = sinon.stub(mongo, 'connect',
        function() { return Promise.resolve(STUB_DB); }
      );
    });
    afterAll(() => { connectStub.restore(); });

    it('Opens db connection and pass it into fn', done => {
      mongo.execute(db => {
        expect(db).toBe(STUB_DB);
      })
      .then(done, done.fail);
    });

    it('Closes db connection when fn resolves', done => {
      var closeSpy = sinon.spy(STUB_DB, 'close');
      var cleanup = () => { closeSpy.restore(); };

      mongo.execute(() => Promise.resolve())
        .then(() => {
          sinon.assert.calledOnce(closeSpy);
        })
        .then(thru(cleanup), thru.rej(cleanup))
        .then(done, done.fail);
    });

    it('Closes db connection when fn rejects', done => {
      var closeSpy = sinon.spy(STUB_DB, 'close');
      var cleanup = () => { closeSpy.restore(); };

      mongo.execute(() => Promise.reject())
        .then(
          () => { throw 'Resolved instead of reject'; },
          () => { sinon.assert.calledOnce(closeSpy); }
        )
        .then(thru(cleanup), thru.rej(cleanup))
        .then(done, done.fail);
    });

    it('Resolves to the value the promise fn returns resolves to', done => {
      const DATA = {};
      mongo.execute(() => Promise.resolve(DATA))
        .then(data => {
          expect(data).toBe(DATA);
        })
        .then(done, done.fail);
    });

    it('Rejects with the value the promise fn returns rejects with', done => {
      const ERROR = new Error();
      mongo.execute(() => Promise.reject(ERROR))
        .then(
          () => { throw 'Resolved instead of reject'; },
          err => { expect(err).toBe(ERROR); }
        )
        .then(done, done.fail);
    });

    it('Resolves to the value fn returns if it\'s not a promise', done => {
      const DATA = {};
      mongo.execute(() => DATA)
        .then(data => {
          expect(data).toBe(DATA);
        })
        .then(done, done.fail);
    });
  });
});
