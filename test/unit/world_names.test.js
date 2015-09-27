'use strict';

var proxyquire = require('proxyquire').noPreserveCache();

const WORLDS = [
  { id: 42, name: 'galaxy' }
];

var world_names = proxyquire('../../lib/server/gw2/world_names', {
  '../utils/ajax': () => Promise.resolve(JSON.stringify(WORLDS))
});

describe('world_names.getName()', () => {
  it('Resolves to world name given a known ID', done => {
    world_names.getName(42)
      .then(
        name => { expect(name).toBe('galaxy'); },
        error => { expect(error).toBeUndefined(); }
      )
      .then(done);
  });

  it('Resolves to undefined when ID is not found', done => {
    world_names.getName(666)
      .then(
        name => { expect(name).toBeUndefined(); },
        error => { expect(error).toBeUndefined(); }
      )
      .then(done);
  });
});
