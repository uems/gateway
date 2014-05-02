var request = require('request');
var qs = require('querystring');

var Q = require('q');

function Connection(credentials) {
  this.get = function(url, parms) {
    var deferred = Q.defer();
    var query = (parms)? '?'+qs.stringify(parms) : '';
    var fullUrl = url + query;

    request.get({ url: fullUrl, json: true, auth: credentials }, function(err, result, body) {
      if (err) {
        deferred.reject(err);
        return;
      }
      deferred.resolve(body);
    });
    return deferred.promise;
  };
  this.post = function(url, parms, data) {
    var deferred = Q.defer();
    var query = (parms)? '?'+qs.stringify(parms) : '';
    var fullUrl = url + query;
    var auth = { user: 'api_user', pass: 'api_pass' };
    console.log('about to post to', fullUrl);
    request.post({ url: fullUrl, json: true, auth: auth, form: data }, function(err, result, body) {
      console.log(body);
      if (err) {
        deferred.reject(err);
        return;
      }
      deferred.resolve(body);
    });
    return deferred.promise;
  };

}

module.exports = {
  build: function(credentials) { return new Connection(credentials); }
};
