'use strict';

var _ = require('underscore');
var ajax = require('../utils/ajax');
var wvw_matches = require('./wvw_matches');
var match_details_store = require('../persistence/match_details_store');

const DATA_SOURCE = 'https://api.guildwars2.com/v1/wvw/match_details.json';
const WORLD_COLORS = ['red', 'blue', 'green'];
const STALE_TIME = 5000; // milliseconds

var getDetailsFromSource = function(matchId) {
  var pData =
    ajax(`${DATA_SOURCE}?match_id=${matchId}`)
      .then(JSON.parse);

  pData.then(match_details_store.add); // async

  return pData;
};

var summarize = function(matches, scores) {
  var worldInfos =
    _.zip(matches, scores)
      .map(pair => ({
        name: pair[0],
        score: pair[1]
      }));

  return _.object(WORLD_COLORS, worldInfos);
};

module.exports = {
  summary: function(matchId) {
    return Promise.all([
      wvw_matches.get(matchId)
        .then(match =>
          WORLD_COLORS
            .map(c => `${c}_world`)
            .map(prop => match[prop])
        ),
      this._getDetails(matchId)
        .then(data => data.scores)
    ])
    .then(arrays => summarize.apply(null, arrays));
  },

  _getDetails: function(matchId) {
    var pLast = match_details_store.getLast(matchId);
    return pLast
      .then(detail => detail.create_date)
      .then(date => Date.now() - date)
      .then(timeDiff => {
        if (timeDiff >= STALE_TIME) { throw 'requires update'; }
      })
      .then(
        () => pLast,
        () => getDetailsFromSource(matchId)
      );
  }
};
