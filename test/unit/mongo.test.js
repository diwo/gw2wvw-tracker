'use strict';

var sinon = require('sinon');
var mongo = require('../../lib/server/persistence/mongo');

const STUB_DB = { close: function() {} };

describe('mongo.execute(fn)', () => {
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
      done();
    });
  });

  it('Closes db connection when fn resolves', done => {
    var closeSpy = sinon.spy(STUB_DB, 'close');
    mongo.execute(() => Promise.resolve())
      .then(
        () => {
          expect(closeSpy.calledOnce).toBeTruthy();
          closeSpy.restore();
          done();
        },
        () => { done.fail('Rejected instead of resolve'); }
      );
  });

  it('Closes db connection when fn rejects', done => {
    var closeSpy = sinon.spy(STUB_DB, 'close');
    mongo.execute(() => Promise.reject())
      .then(
        () => { done.fail('Resolved instead of reject'); },
        () => {
          expect(closeSpy.calledOnce).toBeTruthy();
          closeSpy.restore();
          done();
        }
      );
  });

  it('Resolves to the value the promise fn returns resolves to', done => {
    const DATA = {};
    mongo.execute(() => Promise.resolve(DATA))
      .then(
        data => {
          expect(data).toBe(DATA);
          done();
        },
        () => { done.fail('Rejected instead of resolve'); }
      );
  });

  it('Rejects with the value the promise fn returns rejects with', done => {
    const ERROR = new Error();
    mongo.execute(() => Promise.reject(ERROR))
      .then(
        () => { done.fail('Resolved instead of reject'); },
        err => {
          expect(err).toBe(ERROR);
          done();
        }
      );
  });
});
