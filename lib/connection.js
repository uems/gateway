var request = require('request');
var qs = require('querystring');

var Q = require('q');

module.exports = {
  get: function(url, parms) {
    var deferred = Q.defer();
    var query = (parms)? '?'+qs.stringify(parms) : '';
    var url = url + query;
    var auth = { user: 'api_user', pass: 'api_pass' };

    request.get({ url: url, json: true, auth: auth }, function(err, result, body) {
      if (err) {
        deferred.reject(err);
        return;
      }
      deferred.resolve(body);
    });
    return deferred.promise;
  }
};
