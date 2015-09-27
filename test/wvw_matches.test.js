'use strict';

var proxyquire = require('proxyquire').noPreserveCache();

const MATCHES = {
  wvw_matches: [
    {
      wvw_match_id: '1-2',
      red_world_id: 1000,
      blue_world_id: 1001,
      green_world_id: 1002,
      start_time: '2015-09-25T18:00:00Z',
      end_time: '2015-10-02T18:00:00Z'
    },
    {
      wvw_match_id: '2-3',
      red_world_id: 1010,
      blue_world_id: 1011,
      green_world_id: 1012,
      start_time: '2015-09-25T18:00:00Z',
      end_time: '2015-10-02T18:00:00Z'
    },
  ]
};

const WORLD_NAMES = {
  1000: 'Ruby',
  1001: 'Sapphire',
  1002: 'Emerald'
};

var wvw_matches = proxyquire('../lib/server/gw2/wvw_matches', {
  '../utils/ajax': () => Promise.resolve(JSON.stringify(MATCHES)),
  './world_names': { getName: id => WORLD_NAMES[id] }
});

describe('wvw_matches.list()', () => {
  it('Resolves to matches containing names for red/blue/green worlds', done => {
    wvw_matches.list()
      .then(
        matches => {
          expect(matches[0].red_world).toBe('Ruby');
          expect(matches[0].blue_world).toBe('Sapphire');
          expect(matches[0].green_world).toBe('Emerald');
        },
        error => { expect(error).toBeUndefined(); }
      )
      .then(done);
  });
});

describe('wvw_matches.get(matchId)', () => {
  it('Resolves to a single match with the given match ID', done => {
    wvw_matches.get('2-3')
      .then(
        match => { expect(match.wvw_match_id).toBe('2-3'); },
        error => { expect(error).toBeUndefined(); }
      )
      .then(done);
  });

  it('Resolves to undefined when the given ID cannot be found', done => {
    wvw_matches.get('derp')
      .then(
        match => { expect(match).toBeUndefined(); },
        error => { expect(error).toBeUndefined(); }
      )
      .then(done);
  });
});
