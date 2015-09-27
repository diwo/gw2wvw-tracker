'use strict';

var request = require('request');

module.exports = function(url) {
  return new Promise((resolve, reject) => {
    request(url, (error, response, body) => {
      if (error) {
        reject(error);
      } else if (response.statusCode != 200) {
        reject(response.statusCode);
      } else {
        resolve(body);
      }
    });
  });
};
