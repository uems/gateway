var request = require('request');
var Q = require('Q');

function Client(endpoint) {
  var self = this;

  function discoverEntities() {
    var deferred = Q.defer();
    request.get(endpoint, function(err, result, body) {
    });
    return deferred.promise;
  }


  self.get = function(entity, id) {
    console.log(loaded);
    return loaded;
  }

  self.search = function() {
  };

  // initialization
  var loaded = discoverEntities();
}

module.exports = {
  build: function(endpoint) { return new Client(endpoint); }
}
