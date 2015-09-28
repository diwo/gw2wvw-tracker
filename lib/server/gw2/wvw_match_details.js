'use strict';

var _ = require('underscore');
var ajax = require('../utils/ajax');
var wvw_matches = require('./wvw_matches');
var match_details_store = require('../persistence/match_details_store');

const DATA_SOURCE = 'https://api.guildwars2.com/v1/wvw/match_details.json';
const WORLD_COLORS = ['red', 'blue', 'green'];

var getMatchDetailsFromSource = function(matchId) {
  return ajax(`${DATA_SOURCE}?match_id=${matchId}`)
    .then(JSON.parse);
};

var getMatchDetails = function(matchId) {
  var pDetailsFetch = getMatchDetailsFromSource(matchId);
  pDetailsFetch.then(match_details_store.add);
  return pDetailsFetch; // resolves without waiting on db add
};

module.exports = {
  summary: matchId =>
    Promise.all([
      wvw_matches.get(matchId)
        .then(match =>
          WORLD_COLORS
            .map(c => `${c}_world`)
            .map(prop => match[prop])
        ),
      getMatchDetails(matchId)
        .then(data => data.scores)
    ])
    .then(arrays => _.zip.apply(null, arrays))
    .then(pairs => pairs.map(pair => ({
      name: pair[0],
      score: pair[1]
    })))
    .then(infos => _.object(WORLD_COLORS, infos))
};
