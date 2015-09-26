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
    }
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
  it('Resolved matches contain names for red/blue/green worlds', done => {
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
