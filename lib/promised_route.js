var Q = require('q');

module.exports = function(impl) {
  return function(req, res, next) {
    function outputResult(result) {
      res.json(200, result);
    }

    function outputError(error) {
      var status  = error.status || 500;
      console.log('stack:', error.stack);
      console.log('message:', error);
      return res.send(status, JSON.stringify(error));
    }

    function fastError(status, message) {
      var deferred = Q.defer();
      deferred.reject({ error: message });
      return deferred.promise;
    }

    return impl(req, res, fastError).then(outputResult).fail(outputError).done();
  };
};
