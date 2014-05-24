var jwt = require('jsonwebtoken');
var Q = require('q');

var config = require('../config');

var personService = require('../services/person_service');

var promisedRoute = require('../promised_route');

module.exports = function(app) {
  app.post('/token/from-login', promisedRoute(function(req, res, fastError) {
   return fastError(401, 'Invalid Credentials');
  }));

  app.post('/token/from-hash', promisedRoute(function(req, res, fastError) {
    if (!req.body.hash) {
      return fastError(400, 'Must provide hash');
    }
    return personService.findPersonByLoginHash(req.body.hash).then(function(person) {
      var token = jwt.sign({ xid: person.xid }, config.secret);
      return Q.when({ token: token, grants: 'user', scope: person.xid });
    });
  }));
};
