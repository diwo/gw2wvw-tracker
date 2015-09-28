'use strict';

var proxyquire = require('proxyquire').noPreserveCache();
var sinon = require('sinon');

const GOOD_MATCH_ID = 'goodMatchId';
const MATCH_DETAILS = {
  scores: [111, 222, 333]
};
const MATCH = {
  red_world: 'Ruby',
  blue_world: 'Sapphire',
  green_world: 'Emerald'
};

var stub_match_details_store = { add: function() {} };
var wvw_match_details = proxyquire('../../lib/server/gw2/wvw_match_details', {
  '../utils/ajax': url =>
    url.endsWith(`=${GOOD_MATCH_ID}`) ?
      Promise.resolve(JSON.stringify(MATCH_DETAILS)) :
      Promise.reject(),
  './wvw_matches': {
    get: matchId =>
      matchId == GOOD_MATCH_ID ?
        Promise.resolve(MATCH) :
        Promise.resolve()
  },
  '../persistence/match_details_store': stub_match_details_store
});

describe('wvw_match_details.summary(matchId)', () => {
  it('Resolves to an object with name and score for each of red/blue/green worlds', done => {
    wvw_match_details.summary('goodMatchId')
      .then(
        summary => {
          expect(summary).toEqual({
            red: { name: 'Ruby', score: 111 },
            blue: { name: 'Sapphire', score: 222 },
            green: { name: 'Emerald', score: 333 }
          });
        },
        error => { expect(error).toBeUndefined(); }
      )
      .then(done);
  });

  it('Rejects when the given match ID cannot be found', done => {
    wvw_match_details.summary('match#404')
      .then(
        () => { done.fail('ajax() resolved instead of reject'); },
        () => { done(); }
      );
  });

  it('Adds the match details into datastore', done => {
    var stub = sinon.stub(stub_match_details_store, 'add',
      matchDetails => {
        expect(matchDetails).toEqual(MATCH_DETAILS);
        stub.restore();
        done();
      }
    );
    wvw_match_details.summary('goodMatchId');
  });
});
