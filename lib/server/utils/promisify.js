'use strict';

/*
  promisify(obj, fn, args...)

  Invokes obj.fn(args..., cb{err, data}) and returns a promise which
  rejects with an error when the callback is invoked with a truthy error
  or resolves with data otherwise.
*/
module.exports = function(obj, fn) {
  var fnArgs = Array.prototype.slice.call(arguments, 2);
  return new Promise((resolve, reject) => {
    var cb = (err, data) => {
      if (err) {
        reject(err);
      } else {
        resolve(data);
      }
    };
    fnArgs.push(cb);
    fn.apply(obj, fnArgs);
  });
};
