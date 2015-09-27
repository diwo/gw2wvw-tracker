'use strict';

var _ = require('underscore');
var ajax = require('../utils/ajax');
var world_names = require('./world_names');

const DATA_SOURCE = 'http://api.guildwars2.com/v1/wvw/matches.json';

function resolveWorlds(match) {
  var worldColors = ['red', 'blue', 'green'];
  var worldNameKeys = worldColors.map(c => `${c}_world`);

  return Promise.all(
    worldColors
      .map(c => `${c}_world_id`)
      .map(prop => match[prop])
      .map(id => world_names.getName(id))
  )
  .then(names => _.extend(match, _.object(worldNameKeys, names)));
}

var listMatches = function() {
  return ajax(DATA_SOURCE)
    .then(JSON.parse)
    .then(data => data.wvw_matches)
    .then(matches => Promise.all(matches.map(resolveWorlds)));
};

var getMatch = function(matchId) {
  return listMatches()
    .then(matches => matches.find(m => m.wvw_match_id == matchId));
};

module.exports = {
  list: listMatches,
  get: getMatch
};
