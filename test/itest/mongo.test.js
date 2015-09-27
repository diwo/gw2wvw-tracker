'use strict';

var util = require('util');
var mongo = require('../../lib/server/persistence/mongo');

describe('mongo insert and find operations', () => {
  it('Can be chained together to query for the inserted documents', done => {
    var errors = [];

    mongo.connect()
      .then(db => {
        var testCollection = db.collection('testdocs');

        return mongo.remove(testCollection)
          .then(() => mongo.insert(
            testCollection, [
              { x: 1 }, { x: 2 }, { x: 3 }
            ]
          ))
          .then(result => {
            expect(result.result.n).toBe(3);
          })
          .then(() => mongo.fetch(
            testCollection.find({ x: { $gte: 2 } })
          ))
          .then(result => {
            expect(result.length).toBe(2);
          })
          .then(() => mongo.remove(testCollection))
          .catch(err => { errors.push(err); })
          .then(() => { db.close(); });
      })
      .catch(err => { errors.push(err); })
      .then(() => {
        if (!errors.length) {
          done();
        } else {
          done.fail(util.inspect(errors));
        }
      });
  });
});
