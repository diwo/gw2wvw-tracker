'use strict';

var mongo = require('../../lib/server/persistence/mongo');

describe('mongo insert and find operations', () => {
  it('Can be chained together to query for the inserted documents', done => {
    mongo.execute(db => {
      var testCollection = db.collection('testdocs');

      return testCollection.deleteMany({})
        .then(() => testCollection.insertMany([
          { x: 1 }, { x: 2 }, { x: 3 }
        ]))
        .then(result => {
          expect(result.result.n).toBe(3);
        })
        .then(() => testCollection.find({ x: { $gte: 2 } }))
        .then(cursor => cursor.toArray())
        .then(result => {
          expect(result.length).toBe(2);
        })
        .then(() => testCollection.deleteMany({}));
    })
    .then(done, done.fail);
  });
});
