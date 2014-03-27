var Q = require('Q');

function Client() {
  var self = this;

  self.search = function() {
    var deferred = Q.defer();
    setTimeout(deferred.resolve,1);
    return deferred.promise;
  };
}

module.exports = {
  build: function() { return new Client(); }
}
