var request = require('request');
var qs = require('querystring');

var Q = require('q');

module.exports = {
  post: function(url, parms, data) {
    var deferred = Q.defer();
    var query = (parms)? '?'+qs.stringify(parms) : '';
    var fullUrl = url + query;
    var auth = { user: 'api_user', pass: 'api_pass' };
    request.post({ url: fullUrl, json: true, auth: auth, form: data }, function(err, result, body) {
      if (err) {
        deferred.reject(err);
        return;
      }
      deferred.resolve(body);
    });
    return deferred.promise;
  },
  get: function(url, parms) {
    var deferred = Q.defer();
    var query = (parms)? '?'+qs.stringify(parms) : '';
    var fullUrl = url + query;
    var auth = { user: 'api_user', pass: 'api_pass' };

    request.get({ url: fullUrl, json: true, auth: auth }, function(err, result, body) {
      if (err) {
        deferred.reject(err);
        return;
      }
      deferred.resolve(body);
    });
    return deferred.promise;
  }
};
