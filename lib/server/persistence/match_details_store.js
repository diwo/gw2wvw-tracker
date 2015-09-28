'use strict';

var _ = require('underscore');
var mongo = require('../persistence/mongo');

const COLLECTION_NAME = 'match_details';

module.exports = {
  add: matchDetails =>
    mongo.connect()
      .then(db => {
        var insertError = null;
        var collection = db.collection(COLLECTION_NAME);
        var enhancedData = _.extend(matchDetails, {
          create_date: new Date()
        });

        return mongo.insert(collection, [ enhancedData ])
          .catch(err => { insertError = err; })
          .then(() => {
            db.close();
            if (insertError) {
              throw insertError;
            }
          });
      })
};
