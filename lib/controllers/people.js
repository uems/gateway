var S = require('string');

var promisedRoute = require('../promised_route');

var personService  = require('../services/person_service');
var badgeService   = require('../services/badge_service');

module.exports = function(app) {
  app.post('/people/:xid/print-:kind/:printer', promisedRoute(function(req, res) {
    return badgeService.print(req.params.xid, req.params.kind, req.params.printer);
  }));

  app.post('/people/:xid/move-badge/:location', promisedRoute(function(req, res) {
    return badgeService.move(req.params.xid, req.params.location);
  }));

  app.post('/people/:xid/apply-promocode', promisedRoute(function(req, res) {
    return personService.applyPromocode(req.params.xid, req.body.hash);
  }));

  app.post('/people/:xid/give-badge', promisedRoute(function(req, res) {
    return badgeService.giveBadge(req.params.xid);
  }));

  app.post('/people/:xid/accept-proof', promisedRoute(function(req, res, fastError) {
    if (!req.body.proofFor) {
      return fastError('must select bill id for proof');
    }
    return personService.acceptProof(req.params.xid, req.body.proofFor, req.ip);
  }));

  app.post('/people/:xid/accept-cash', promisedRoute(function(req, res, fastError) {
    if (!req.body.ticket) {
      return fastError('must provide ticket object');
    }
    return personService.acceptCash(req.params.xid, req.body.ticket, req.ip);
  }));

  app.get('/people/:xid', promisedRoute(function(req, res) {
    return personService.get(req.params.xid);
  }));

  app.post('/people', promisedRoute(function(req, res, fastError) {
    if (!req.body.email) {
      return fastError('must provide email');
    }
    return personService.createPerson(req.body.email);
  }));

  app.get('/people', promisedRoute(function(req, res, fastError) {
    if (!req.query.q) {
      return fastError('must provide q');
    }
    return personService.search(req.query.q);
  }));


  function buildSetter(field) {
    var routeName  = S('set-'+field).dasherize().s;
    var setterName = S('set-'+field).camelize().s;
    var bodyName   = S(field).camelize().s;

    function changedResult(result) {
      return { changed: result };
    }

    app.post('/people/:xid/'+ routeName, promisedRoute(function(req, res, fastError) {
      if (!req.body[bodyName]) {
        return fastError('must provide '+ bodyName);
      }
      return personService[setterName](req.params.xid, req.body[bodyName]).then(changedResult);
    }));
  }

  buildSetter('name');
  buildSetter('email');
  buildSetter('document');
  buildSetter('badgeName');
  buildSetter('badgeCorp');
  buildSetter('country');
  buildSetter('city');
  buildSetter('category');
};
