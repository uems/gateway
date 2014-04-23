var request = require('request');
var qs = require('querystring')
var Q = require('Q');

function Client(endpoint) {
  var self = this;

  function discoverEntities() {
    var deferred = Q.defer();
    deferred.resolve({
      people: relativeUrl('/people'),
      groups: relativeUrl('/groups')
    });
    return deferred.promise;
  }

  function relativeUrl(path) {
    return endpoint + path
  }

  function getByEntityAndId(entityEndpoint, id) {
    var url = entityEndpoint + "/" + id;
    var deferred = Q.defer();
    request.get({ url: url, json: true }, function(err, result, body) {
      if (err) { deferred.reject(err); return; }
      deferred.resolve(body);
    });
    return deferred.promise;
  }

  function searchEntity(entityEndpoint, parms) {
    var url = entityEndpoint + "?" + qs.stringify(parms);
    var deferred = Q.defer();

    request.get({ url: url, json: true }, function(err, result, body) {
      if (err) { deferred.reject(err); return }
      deferred.resolve(body);
    });

    return deferred.promise;
  }


  self.entities = function() {
    return entityMap.then(function(map) {
      return Object.keys(map);
    });
  }

  self.get = function(entity, id) {
    return entityMap.then(function(map) {
      return getByEntityAndId(map[entity], id)
    });
  }

  self.search = function(entity, query) {
    return entityMap.then(function(map) {
      return searchEntity(map[entity], { "query": query } );
    });
  }

  // initialization
  var entityMap = discoverEntities();
}

module.exports = {
  build: function(endpoint) { return new Client(endpoint); }
}
