var promisedRoute = require('../promised_route');
var badgeService  = require('../services/badge_service');

module.exports = function(app) {
  app.post('/badge/:printer', promisedRoute(function(req, res, fastError) {
    if (!req.body.reason) {
      return fastError(400, 'must provide reason');
    }
    if (!req.body.name) {
      return fastError(400, 'must provide name');
    }
    if (!req.body.corp) {
      return fastError(400, 'must provide company name');
    }

    return badgeService.createSingle(req.params.printer, req.body.reason, req.body.name, req.body.corp);
  }));
};
