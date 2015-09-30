'use strict';

/*
  Used in a promise chain to cause side-effects without
  altering the resolution or rejection value.
  E.g.
    asyncTest()
      .then(
        thru(cleanup),
        thru.rej(cleanup)
      )
      .then(done, failtest)
*/
var thru = function(fn) {
  return function(x) {
    fn(x);
    return x;
  };
};

thru.rej = function(fn) {
  return function(x) {
    fn(x);
    throw x;
  };
};

module.exports = thru;
