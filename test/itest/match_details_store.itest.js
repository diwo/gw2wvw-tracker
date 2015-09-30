'use strict';

var match_details_store = require('../../lib/server/persistence/match_details_store');

describe('match details add and getLast', () => {
  it('getLast resolves to last match detail added for the given match id', done => {
    match_details_store.add({ 'match_id': 1, n: 1 })
      .then(() => match_details_store.add({ 'match_id': 1, n: 2 }))
      .then(() => match_details_store.add({ 'match_id': 2, n: 3 }))
      .then(() => match_details_store.getLast(1))
      .then(details => {
        expect(details.n).toBe(2);
      })
      .then(done, done.fail);
  });
});
