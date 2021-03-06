'use strict';

var proxyquire = require('proxyquire').noPreserveCache();

const URLs = {
  ok: 'ok',
  notFound: 'notFound',
  failure: 'failure'
};

const RESPONSE = {
  ok: {
    error: null,
    statusCode: 200,
    body: 'body'
  },
  notFound: {
    error: null,
    statusCode: 404
  },
  failure: {
    error: Error('error')
  }
};

const AJAX_DELAY = 0;

var ajax = proxyquire('../../lib/server/utils/ajax', {
  request: function(url, cb) {
    switch(url) {
      case URLs.ok:
        setTimeout(() => {
          cb(RESPONSE.ok.error, { statusCode: RESPONSE.ok.statusCode }, RESPONSE.ok.body);
        }, AJAX_DELAY);
        break;
      case URLs.notFound:
        setTimeout(() => {
          cb(RESPONSE.notFound.error, { statusCode: RESPONSE.notFound.statusCode }, RESPONSE.notFound.body);
        }, AJAX_DELAY);
        break;
      case URLs.failure:
        setTimeout(() => { cb(RESPONSE.failure.error); }, AJAX_DELAY);
        break;
      default:
        throw Error('Unhandled test case');
    }
  }
});

describe('ajax function', () => {
  it('Resolves to response body when request is successful', done => {
    ajax(URLs.ok)
      .then(body => {
        expect(body).toBe(RESPONSE.ok.body);
      })
      .then(done, done.fail);
  });

  it('Rejects with status code when request url is not found', done => {
    ajax(URLs.notFound)
      .then(
        () => { throw 'Resolved intead of reject'; },
        statusCode => {
          expect(statusCode).toBe(RESPONSE.notFound.statusCode);
        }
      )
      .then(done, done.fail);
  });

  it('Rejects with error when request is failure', done => {
    ajax(URLs.failure)
      .then(
        () => { throw 'Resolved instead of reject'; },
        error => {
          expect(error).toBe(RESPONSE.failure.error);
        }
      )
      .then(done, done.fail);
  });
});
