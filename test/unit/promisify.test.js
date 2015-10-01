'use strict';

var sinon = require('sinon');
var promisify = require('../../lib/server/utils/promisify');

const ERROR = new Error();
const DATA = 'data';

describe('promisify(obj, fn, args...) function', () => {
  it('Returns a promise', () => {
    var p = promisify(null, function() {}, 1, 2, 3);
    expect(p).toEqual(jasmine.any(Promise));
  });

  describe('The promise returned by promisify(obj, fn, args...)', () => {
    it('Invokes obj.fn(args..., cb)', () => {
      var o = {};
      var fn = sinon.spy();

      promisify(o, fn, 1, 2, 3);

      sinon.assert.calledOn(fn, o);
      sinon.assert.calledWith(fn, 1, 2, 3);
    });

    it('Rejects with err if cb(err) and err is truthy', done => {
      var o = {};
      var fn = function(cb) { cb(ERROR); };

      promisify(o, fn)
        .then(
          () => { throw 'Resolved instead of reject'; },
          rejVal => { expect(rejVal).toBe(ERROR); }
        )
        .then(done, done.fail);
    });

    it('Resolves to data if cb(err, data) is called and err is not truthy', done => {
      var o = {};
      var fn = function(cb) { cb(null, DATA); };

      promisify(o, fn)
        .then(resVal => {
          expect(resVal).toBe(DATA);
        })
        .then(done, done.fail);
    });
  });
});
