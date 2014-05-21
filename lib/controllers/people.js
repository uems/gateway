var S = require('string');

var auth = require('../auth');

var promisedRoute = require('../promised_route');

var personService      = require('../services/person_service');
var badgeService       = require('../services/badge_service');
var certificateService = require('../services/certificate_service');
var mailerService      = require('../services/mailer_service');

module.exports = function(app) {
  app.post('/people/:xid/print-:kind/:printer', auth.requireAdmin, promisedRoute(function(req, res) {
    return badgeService.print(req.params.xid, req.params.kind, req.params.printer);
  }));

  app.post('/people/:xid/move-badge/:location', auth.requireAdmin, promisedRoute(function(req, res) {
    return badgeService.move(req.params.xid, req.params.location);
  }));

  app.post('/people/:xid/apply-promocode', auth.requireAdmin, promisedRoute(function(req, res) {
    return personService.applyPromocode(req.params.xid, req.body.hash);
  }));

  app.post('/people/:xid/give-badge', auth.requireAdmin, promisedRoute(function(req, res) {
    return badgeService.giveBadge(req.params.xid);
  }));

  app.post('/people/:xid/accept-proof', auth.requireAdmin, promisedRoute(function(req, res, fastError) {
    if (!req.body.proofFor) {
      return fastError('must select bill id for proof');
    }
    return personService.acceptProof(req.params.xid, req.body.proofFor, req.ip);
  }));

  app.post('/people/:xid/accept-cash', auth.requireAdmin, promisedRoute(function(req, res, fastError) {
    if (!req.body.ticket) {
      return fastError('must provide ticket object');
    }
    return personService.acceptCash(req.params.xid, req.body.ticket, req.ip);
  }));

  app.post('/people/:xid/issue-certificate', auth.requireMatchingXid, promisedRoute(function(req, res) {
    return certificateService.issueCertificate(req.params.xid);
  }));

  app.post('/people/:xid/reset-login-hash', auth.requireAdmin, promisedRoute(function(req, res) {
    return personService.resetLoginHash(req.params.xid);
  }));

  app.post('/people/:xid/call-for-certificate', auth.requireAdmin, promisedRoute(function(req, res, fastError) {
    return personService.get(req.params.xid).then(function(person) {
      return mailerService.sendCallForCertificate(person);
    });
  }));

  app.get('/people/:xid', auth.requireMatchingXid, promisedRoute(function(req, res) {
    return personService.get(req.params.xid);
  }));

  app.post('/people', auth.requireAdmin, promisedRoute(function(req, res, fastError) {
    if (!req.body.email) {
      return fastError(400, 'must provide email');
    }
    return personService.createPerson(req.body.email);
  }));

  app.get('/people', auth.requireAdmin, promisedRoute(function(req, res, fastError) {
    if (!req.query.q) {
      return fastError(400, 'must provide q');
    }
    return personService.search(req.query.q);
  }));


  function buildSetter(auth, field) {
    var routeName  = S('set-'+field).dasherize().s;
    var setterName = S('set-'+field).camelize().s;
    var bodyName   = S(field).camelize().s;

    function changedResult(result) {
      return { changed: result };
    }

    app.post('/people/:xid/'+ routeName, auth, promisedRoute(function(req, res, fastError) {
      console.log(req.body);
      if (!req.body[bodyName]) {
        return fastError(400, 'must provide '+ bodyName);
      }
      return personService[setterName](req.params.xid, req.body[bodyName]).then(changedResult);
    }));
  }

  buildSetter(auth.requireMatchingXid, 'name');
  buildSetter(auth.requireMatchingXid, 'certificateName');

  buildSetter(auth.requireAdmin,       'email');
  buildSetter(auth.requireAdmin,       'document');
  buildSetter(auth.requireAdmin,       'badgeName');
  buildSetter(auth.requireAdmin,       'badgeCorp');
  buildSetter(auth.requireAdmin,       'country');
  buildSetter(auth.requireAdmin,       'city');
  buildSetter(auth.requireAdmin,       'category');
};
