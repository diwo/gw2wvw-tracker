'use strict';

var proxyquire = require('proxyquire');
var sinon = require('sinon');
var thru = require('../../lib/server/utils/thru');

const STUB = {
  VALID_MATCH_ID: 'validMatchId',
  AJAX_DETAILS: { scores: [111, 222, 333] },

  ajax: function(url) {
    if (url.endsWith(`=${STUB.VALID_MATCH_ID}`)) {
      return Promise.resolve(JSON.stringify(STUB.AJAX_DETAILS));
    }
    return Promise.reject();
  },

  matches: {
    get: function(matchId) {
      switch(matchId) {
        case STUB.VALID_MATCH_ID:
          return Promise.resolve({
            red_world: 'Ruby',
            blue_world: 'Sapphire',
            green_world: 'Emerald'
          });
        default:
          return Promise.resolve();
      }
    }
  },

  match_details_store: {
    add: function() {},
    getLast: function() { return Promise.resolve(null); }
  }
};

var stubMatchDetails = stub => {
  proxyquire.noPreserveCache();
  return proxyquire('../../lib/server/gw2/wvw_match_details', {
    '../utils/ajax': stub.ajax.bind(stub),
    './wvw_matches': stub.matches,
    '../persistence/match_details_store': stub.match_details_store
  });
};

describe('wvw_match_details.summary(matchId)', () => {
  var wvw_match_details = stubMatchDetails(STUB);

  it('Resolves to an object with name and score for each of red/blue/green worlds', done => {
    wvw_match_details.summary(STUB.VALID_MATCH_ID)
      .then(
        summary => {
          expect(summary).toEqual({
            red: { name: 'Ruby', score: 111 },
            blue: { name: 'Sapphire', score: 222 },
            green: { name: 'Emerald', score: 333 }
          });
        }
      )
      .then(done, done.fail);
  });

  it('Rejects when the given match ID cannot be found', done => {
    wvw_match_details.summary('match#404')
      .then(
        () => { done.fail('Resolved instead of reject'); },
        () => { done(); }
      );
  });

  describe('Fetching match details from datastore', () => {
    it('Resolves match details from source if there is none in datastore', done => {
      var getLastStub = sinon.stub(
        STUB.match_details_store, 'getLast',
        () => Promise.resolve(null));

      var cleanup = () => { getLastStub.restore(); };

      wvw_match_details = stubMatchDetails(STUB);

      wvw_match_details._getDetails(STUB.VALID_MATCH_ID)
        .then(details => {
          expect(details).toEqual(STUB.AJAX_DETAILS);
        })
        .then(thru(cleanup), thru.rej(cleanup))
        .then(done, done.fail);
    });

    it('Resolves match details from datastore if fresh', done => {
      const FRESH_DETAILS = { create_date: Date.now() };

      var getLastStub = sinon.stub(
        STUB.match_details_store, 'getLast',
        () => Promise.resolve(FRESH_DETAILS));

      var cleanup = () => { getLastStub.restore(); };

      wvw_match_details = stubMatchDetails(STUB);

      wvw_match_details._getDetails(STUB.VALID_MATCH_ID)
        .then(details => {
          expect(details).toEqual(FRESH_DETAILS);
        })
        .then(thru(cleanup), thru.rej(cleanup))
        .then(done, done.fail);
    });

    it('Resolves match details from source if the copy in datastore is stale', done => {
      const STALE_DETAILS = { create_date: new Date(0) };

      var getLastStub = sinon.stub(
        STUB.match_details_store, 'getLast',
        () => Promise.resolve(STALE_DETAILS));

      var cleanup = () => { getLastStub.restore(); };

      wvw_match_details = stubMatchDetails(STUB);

      wvw_match_details._getDetails(STUB.VALID_MATCH_ID)
        .then(details => {
          expect(details).toEqual(STUB.AJAX_DETAILS);
        })
        .then(thru(cleanup), thru.rej(cleanup))
        .then(done, done.fail);
    });
  });

  describe('Adding match details to datastore', () => {
    it('Adds fresh details from source to datastore if datastore copy is stale', done => {
      const STALE_DETAILS = { create_date: new Date(0) };

      var getLastStub = sinon.stub(
        STUB.match_details_store, 'getLast',
        () => Promise.resolve(STALE_DETAILS));

      var addSpy = sinon.spy(STUB.match_details_store, 'add');

      var cleanup = () => {
        getLastStub.restore();
        addSpy.restore();
      };

      wvw_match_details = stubMatchDetails(STUB);

      wvw_match_details._getDetails(STUB.VALID_MATCH_ID)
        .then(() => {
          sinon.assert.calledOnce(addSpy);
        })
        .then(thru(cleanup), thru.rej(cleanup))
        .then(done, done.fail);
    });

    it('Does not add details to datastore if feched copy is fresh', done => {
      const FRESH_DETAILS = { create_date: Date.now() };

      var getLastStub = sinon.stub(
        STUB.match_details_store, 'getLast',
        () => Promise.resolve(FRESH_DETAILS));

      var addSpy = sinon.spy(STUB.match_details_store, 'add');

      var cleanup = () => {
        getLastStub.restore();
        addSpy.restore();
      };

      wvw_match_details = stubMatchDetails(STUB);

      wvw_match_details._getDetails(STUB.VALID_MATCH_ID)
        .then(() => {
          sinon.assert.notCalled(addSpy);
        })
        .then(thru(cleanup), thru.rej(cleanup))
        .then(done, done.fail);
    });
  });
});
