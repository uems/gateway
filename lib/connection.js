var request = require('request');

var Q = require('q');

module.exports = {
  get: function(url) {
    var deferred = Q.defer();
    request.get({ url: url, json: true }, function(err, result, body) {
      if (err) { deferred.reject(err); return; }
      deferred.resolve(body);
    });
    return deferred.promise;
  }
};
