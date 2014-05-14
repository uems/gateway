var promisedRoute = require('../promised_route');
var personService = require('../services/person_service');

module.exports = function(app) {
  app.get('/listing', promisedRoute(function(req, res) {
    return personService.listing();
  }));
};
