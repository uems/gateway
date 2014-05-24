var request = require('request');
var qs = require('querystring');

var Q = require('q');

function Connection(basePath) {
  this.get = function(path, parms) {
    var deferred = Q.defer();
    var query = (parms)? '?'+qs.stringify(parms) : '';
    var fullUrl = basePath + path + query;

    request.get({ url: fullUrl, json: true }, function(err, result, body) {
      console.log('GET', result && result.statusCode, fullUrl, err);
      if (err) {
        deferred.reject({ err: err });
      }
      else if (result && result.statusCode >= 400) {
        deferred.reject({ err: body.error, status: result.statusCode });
      }
      else {
        deferred.resolve(body);
      }
    });
    return deferred.promise;
  };
}

module.exports = {
  build: function(basePath) { return new Connection(basePath); }
};
