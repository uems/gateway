var config        = require('../config');
var promisedRoute = require('../promised_route');
var connection    = require('../services/connection').build(config.api_path);

module.exports = function(app) {
  app.get('*', promisedRoute(function(req, res) {
    return connection.get(req.path, req.query);
  }));
};
