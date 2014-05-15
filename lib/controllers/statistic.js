var auth = require('../auth');
var promisedRoute = require('../promised_route');
var personService = require('../services/person_service');


module.exports = function(app) {
  app.get('/listing', auth.requireAdmin, promisedRoute(function(req, res) {
    return personService.listing();
  }));
};
