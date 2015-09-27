'use strict';

var _ = require('underscore');
var ajax = require('../utils/ajax');
var wvw_matches = require('./wvw_matches');

const DATA_SOURCE = 'https://api.guildwars2.com/v1/wvw/match_details.json';
const WORLD_COLORS = ['red', 'blue', 'green'];

module.exports = {
  summary: matchId =>
    Promise.all([
      wvw_matches.get(matchId)
        .then(match =>
          WORLD_COLORS
            .map(c => `${c}_world`)
            .map(prop => match[prop])
        ),
      ajax(`${DATA_SOURCE}?match_id=${matchId}`)
        .then(JSON.parse)
        .then(data => data.scores)
    ])
    .then(arrays => _.zip.apply(null, arrays))
    .then(pairs => pairs.map(pair => ({
      name: pair[0],
      score: pair[1]
    })))
    .then(infos => _.object(WORLD_COLORS, infos))
};
