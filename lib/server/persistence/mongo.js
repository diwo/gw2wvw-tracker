'use strict';

var MongoClient = require('mongodb').MongoClient;
var appConfig = require('../../../app.config.json');

const DB_URL = `mongodb://${appConfig.db_host}:${appConfig.db_port}/${appConfig.db_name}`;

/*
  Opens a db connection and execute the given function using this connection.
  Handles closing the db connection afterwards as well as resolving/rejecting to
  the value the promise returned by the given function would resolve/reject to.
*/
var execute = function(fn) {
  var fnData = null;
  var fnError = null;
  var rejected = false;

  // connect is invoked as a method so that it can be stubbed
  return this.connect()
    .then(db => {
      var fnRet = fn(db);
      var promise = (fnRet instanceof Promise) ?
        fnRet : Promise.resolve(fnRet);

      return promise
        .then(data => { fnData = data; })
        .catch(err => {
          rejected = true;
          fnError = err;
        })
        .then(() => {
          db.close();
          if (rejected) {
            throw fnError;
          }
          return fnData;
        });
    });
};

module.exports = {
  execute: execute,
  connect: MongoClient.connect.bind(MongoClient, DB_URL)
};
