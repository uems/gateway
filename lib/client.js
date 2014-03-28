var Q = require('Q');

function Client() {
  var self = this;

  self.search = function() {
    var deferred = Q.defer();
    deferred.resolve([]);
    return deferred.promise;
  };
}

module.exports = {
  build: function() { return new Client(); }
}
