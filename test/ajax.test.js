'use strict';

var proxyquire = require('proxyquire').noPreserveCache();

const URLs = {
  success: 'success',
  failure: 'failure'
};

const RESPONSE = {
  success: {
    body: 'body'
  },
  failure: {
    error: Error('error')
  }
};

var ajax = proxyquire('../lib/server/utils/ajax', {
  request: function(url, cb) {
    switch(url) {
      case URLs.success:
        setTimeout(() => { cb(null, {}, RESPONSE.success.body); }, 200);
        break;
      case URLs.failure:
        setTimeout(() => { cb(RESPONSE.failure.error); }, 200);
        break;
      default:
        throw Error('Unhandled test case');
    }
  }
});

describe('ajax()', () => {
  it('Resolves to response body when request is successful', done => {
    ajax(URLs.success)
      .then(
        body => { expect(body).toBe(RESPONSE.success.body); },
        error => { expect(error).toBeUndefined(); }
      )
      .then(done);
  });

  it('Rejects with error when request is failure', done => {
    ajax(URLs.failure)
      .then(
        () => { done.fail('ajax() resolved instead of reject'); },
        error => { expect(error).toBe(RESPONSE.failure.error); }
      )
      .then(done);
  });
});
