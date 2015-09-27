'use strict';

var MongoClient = require('mongodb').MongoClient;
var promisify = require('../utils/promisify');
var appConfig = require('../../../app.config.json');

const DB_URL = `mongodb://${appConfig.db_host}:${appConfig.db_port}/${appConfig.db_name}`;

var connect = () =>
  promisify(MongoClient, MongoClient.connect, DB_URL);

var insert = (collection, docs) =>
  promisify(collection, collection.insert, docs);

var remove = (collection, criteria) =>
  promisify(collection, collection.remove, criteria);

var fetch = (cursor) =>
  promisify(cursor, cursor.toArray);

module.exports = {
  connect: connect,
  insert: insert,
  fetch: fetch,
  remove: remove
};
