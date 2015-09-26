'use strict';

var _ = require('underscore');
var ajax = require('../utils/ajax');
var world_names = require('./world_names');

var endpoint = 'http://api.guildwars2.com/v1/wvw/matches.json';

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

module.exports = {
  list: () =>
    ajax(endpoint)
      .then(JSON.parse)
      .then(data => data.wvw_matches)
      .then(matches => Promise.all(matches.map(resolveWorlds)))
};
