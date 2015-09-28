'use strict';

var _ = require('underscore');
var mongo = require('../persistence/mongo');

const COLLECTION_NAME = 'match_details';

module.exports = {
  add: matchDetails =>
    mongo.execute(db => {
      var collection = db.collection(COLLECTION_NAME);
      var enhancedData = _.extend(matchDetails, {
        create_date: new Date()
      });

      return collection.insertOne(enhancedData);
    }),

  getLast: () =>
    mongo.execute(db =>
      db.collection(COLLECTION_NAME)
        .find()
        .sort({ 'create_date': -1 })
        .next()
    )
};
