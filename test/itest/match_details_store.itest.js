'use strict';

var match_details_store = require('../../lib/server/persistence/match_details_store');

describe('match details add and getLast', () => {
  it('getLast resolves to last match detail added', done => {
    match_details_store.add({ n: 1 })
      .then(() => match_details_store.add({ n: 2 }))
      .then(() => match_details_store.add({ n: 3 }))
      .then(() => match_details_store.getLast())
      .then(details => { expect(details.n).toBe(3); })
      .then(
        () => { done(); },
        err => { done.fail(err); }
      );
  });
});
