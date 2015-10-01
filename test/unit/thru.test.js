'use strict';

var sinon = require('sinon');
var thru = require('../../lib/server/utils/thru');

describe('thru module', () => {
  describe('thru(fn) function', () => {
    it('Returns a function', () => {
      var f = thru(() => null);
      expect(f).toEqual(jasmine.any(Function));
    });

    describe('The function returned by thru(fn)', () => {
      it('When called with arg, invokes fn(arg)', () => {
        var spyFn = sinon.spy();
        thru(spyFn)(42);
        sinon.assert.calledWith(spyFn, 42);
      });

      it('When called with arg, returns arg', () => {
        var ret = thru(() => null)(42);
        expect(ret).toBe(42);
      });
    });
  });

  describe('thru.rej(fn)', () => {
    it('Returns a function', () => {
      var f = thru.rej(() => null);
      expect(f).toEqual(jasmine.any(Function));
    });

    describe('The function returned by thru.rej(fn)', () => {
      it('When called with arg, invokes fn(arg)', () => {
        var spyFn = sinon.spy();
        var error = new Error();

        try {
          thru.rej(spyFn)(error);
        } catch(e) {}

        sinon.assert.calledWith(spyFn, error);
      });

      it('When called with arg, throws arg', () => {
        var error = new Error();
        var spyRej = sinon.spy(thru.rej(() => null));

        try {
          spyRej(error);
        } catch(e) {}

        sinon.assert.threw(spyRej, error);
      });
    });
  });
});
