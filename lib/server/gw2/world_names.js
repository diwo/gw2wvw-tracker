'use strict';

var _ = require('underscore');
var ajax = require('../utils/ajax');

var endpoint = 'https://api.guildwars2.com/v1/world_names.json';

function toNamesMap(worldsList) {
  return _.object(
    _.pluck(worldsList, 'id'),
    _.pluck(worldsList, 'name')
  );
}

var pWorldNamesRaw = ajax(endpoint);

module.exports = {
  getName: id =>
    pWorldNamesRaw
      .then(JSON.parse)
      .then(toNamesMap)
      .then(names => names[id])
};
