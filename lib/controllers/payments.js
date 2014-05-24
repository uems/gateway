var promisedRoute     = require('../promised_route');
var cashTicketService = require('../services/cash_ticket_service');
var personService     = require('../services/person_service');

module.exports = function(app) {
  app.get('/payments/:ip', promisedRoute(function(req, res, fastError) {
    return cashTicketService.getPaymentsByIp(req.params.ip, req.query.day, personService);
  }));
};
